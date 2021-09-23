#!/usr/bin/env node
import { on, once } from 'events'
import { pathToFileURL } from 'url'
import readline from 'readline'
import { resolve } from 'path'
import minimist from 'minimist'
import glob from 'glob'
import chokidar from 'chokidar'
import { bold, dim } from 'colorette'
import esc from 'ansi-escapes'
import onExit from 'signal-exit'
import sleep from 'atomic-sleep'
import Menu from 'menu-string'
import test, { configure } from './index.js'
import { kMain, kChildren, kLevel, kReset } from './lib/symbols.js'

const { CI = 0 } = process.env
const args = minimist(process.argv.slice(2), {
  strings: ['reporter'],
  booleans: ['watch'],
  alias: {
    reporter: ['R', 'r'],
    watch: ['w']
  }
})
const { _: files, watch = !CI } = args
let { reporter = 'tap' } = args
const cwd = process.cwd()
const paths = [...new Set(files.flatMap((f) => glob.sync(f)).filter((f) => /\.(c|m)?js/.test(f)).map((f) => pathToFileURL(resolve(cwd, f)).href))]

if (paths.length === 0) process.exit()

async function report (reporter) {
  switch (reporter.toLowerCase()) {
    case 'tap': return process.stdout
    case 'dot':
    case 'spec': {
      const {default: rep} = await import('tap-mocha-reporter')
      const transform = rep(reporter)
      return transform
    }
  }
}

async function selectReporter () {
  const reporters = ['tap', 'dot', 'spec']
  const menu = new Menu({
    items: reporters.map((text) => ({ text, marked: text === reporter })),
    selected: reporters.indexOf(reporter),
    render (item, selected) {
      const label = item.marked ? bold(item.text) : item.text
      return selected ? `   🥜 ${label}` : `      ${label}`
    }
  })
  process.stdout.write('\n📋 Select a reporter\n\n')
  process.stdout.write(menu.toString() + '\n')
  while (true) {
    const [ , key ] = await once(process.stdin, 'keypress')
    if (key.name === 'up') menu.up()
    if (key.name === 'down') menu.down()
    if (key.name === 'return' || key.name === 'enter') {
      reporter = menu.selected().text
      process.stdout.write(esc.eraseLines(menu.items.length + 3))
      process.stdout.write(`\n📋 Selected reporter: ${bold(reporter)}\n\n`)
      await run(true)
      break
    }
    process.stdout.write(esc.cursorUp(menu.items.length))
    process.stdout.write(menu.toString() + '\n')
  }
}

onExit(() => { process.stdout.write(esc.cursorShow) })
process.stdout.write(esc.cursorHide)

if (watch) {
  process.stdin.setRawMode(true)
  readline.emitKeypressEvents(process.stdin)
  process.stdin.on('keypress', async (ch, key) => {
    if (ch === 'x') {
      process.stdout.write('\n')
      process.exit()
    }
    if (key.name === 'c' && key.ctrl) {
      process.kill(process.pid, 'SIGINT')
    }
    try {
      if (ch === 'w') await run(true)
      if (ch === 'r') await selectReporter()
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  })

  process.stdout.write(esc.cursorSavePosition)
}

await run()

if (watch) {
  const watcher = chokidar.watch(cwd, { ignoreInitial: true, ignored: /node_modules/, cwd: cwd })
  for await (const [evt, file] of on(watcher, 'all')) {
    console.log(dim(`\nchange detected ${file} (${evt})`))
    await run(true)
  }
}

async function run (rerun = false) {
  if (rerun) {
    process.stdout.write(esc.clearScreen)
    sleep(10) // prevent flicker
    process.stdout.write(esc.cursorRestorePosition)
    process.stdout.write(esc.scrollUp)
    process.stdout.write(esc.scrollUp)
  }

  const output = await report(reporter)
  const main = test[kMain]
  main[kReset]()
  configure({ output, [kLevel]: 1 })

  let index = 1
  const start = process.hrtime.bigint()
  output.write('TAP version 13')
  for (const path of paths) {
    const start = process.hrtime.bigint()
    const title = path.slice(cwd.length + 8)
    output.write(`\n# ${title}\n`)
    await import(`${path}?cacheBust=${Date.now()}`)
    const results = await Promise.allSettled(main[kChildren])
    await main.end()
    main[kReset]()
    let summary = ''
    for (const { status, value } of results) {
      if (status !== 'fulfilled' || value.failing > 0) {
        summary = 'not '
        break
      }
    }
    summary += `ok ${index++} - ${title}`
    output.write(`${summary} # time=${(Number(process.hrtime.bigint() - start)) / 1e6}ms\n`)
  }
  await Promise.allSettled(main[kChildren])

  output.write(`\n1..${index - 1}\n`)
  output.write(`# time=${(Number(process.hrtime.bigint() - start)) / 1e6}ms\n`)
  if (output !== process.stdout) output.end()
  main.end()
  main[kReset]()

  if (watch) {
    process.stdout.write(`\n🥜 Watch mode on\n   Press ${bold('w')} to force reload\n   Press ${bold('r')} to change reporter\n   Press ${bold('x')} to exit\n`)
  }

}
