#!/usr/bin/env node
import { realpathSync } from 'fs'
import { createRequire } from 'module'
import { on, once } from 'events'
import { pathToFileURL } from 'url'
import readline from 'readline'
import { join, resolve } from 'path'
import minimist from 'minimist'
import glob from 'glob'
import chokidar from 'chokidar'
import { bold, dim } from 'colorette'
import esc from 'ansi-escapes'
import onExit from 'signal-exit'
import sleep from 'atomic-sleep'
import Menu from 'menu-string'
import open from 'open'
import pkgDir from 'pkg-dir'
import ciInfo from 'ci-info'
import test, { configure } from './index.js'
import usage, { covUsage } from './usage.mjs'
import { kMain, kChildren, kLevel, kReset } from './lib/symbols.js'

const { NODE_V8_COVERAGE } = process.env
const CI = ciInfo.isCI
const argv = process.argv.slice(2)
const args = minimist(argv, {
  strings: ['reporter', 'cov-exclude', 'cov-include', 'cov-all', 'cov-dir', 'cov-reporter', 'cov-clean', 'lines', 'functions', 'statements', 'branches'],
  boolean: ['watch', '100', '90', '85', 'cov', 'cov-skip-full', 'cov-per-file', 'show-cov-report', 'help', '--cov-help', 'snap'],
  default: {
    cov: true,
    watch: false,
    reporter: 'tap',
    'cov-clean': true,
    'cov-dir': join(await pkgDir(), 'coverage')
  },
  alias: {
    help: ['h'],
    reporter: ['R', 'r'],
    watch: ['w'],
    'cov-report': ['cov-reporter'],
    'show-cov-report': ['scr']
  }
})

const { _: files, cov, scr } = args

if (args.help) {
  process.stdout.write(usage)
  process.exit()
}
if (args['cov-help']) {
  process.stdout.write(covUsage)
  process.exit()
}

let { reporter, watch } = args
if (CI) {
  watch = false
  reporter = 'tap'
}

const cwd = process.cwd()
const paths = [...new Set(files.flatMap((f) => glob.sync(f)).filter((f) => /\.(c|m)?js/.test(f)).map((f) => pathToFileURL(resolve(cwd, f)).href))]

if (!scr && paths.length === 0) {
  console.error('Brittle: Specify one or more test paths')
  process.stdout.write(usage)
  process.exit()
}

if (cov === true && (!NODE_V8_COVERAGE || scr)) {
  const require = createRequire(import.meta.url)
  const c8 = realpathSync(require.resolve('.bin/c8'))
  const covStringArgs = Object.entries({
    '--exclude': args['cov-exclude'],
    '--include': args['cov-include'],
    '--all': args['cov-all'],
    '--reports-dir': args['cov-dir'],
    '--reporter': args['cov-reporter'],
    '--clean': args['cov-clean'],
    '--lines': args[100] ? '100' : (args[90] ? '90' : (args[85] ? '85' : args['cov-lines'])),
    '--statements': args[100] ? '100' : (args[90] ? '90' : (args[85] ? '85' : args['cov-statements'])),
    '--branches': args[100] ? '100' : (args[90] ? '90' : (args[85] ? '85' : args['cov-branches'])),
    '--functions': args[100] ? '100' : (args[90] ? '90' : (args[85] ? '85' : args['cov-functions']))
  }).filter(([, v]) => v).flat()
  const covBooleanArgs = [
    '--per-file',
    '--skip-full'
  ].filter((k) => args[`cov${k.slice(1)}`])

  const checkCoverage = covStringArgs.includes('--lines') ||
  covStringArgs.includes('--statements') ||
  covStringArgs.includes('--branches') ||
  covStringArgs.includes('--functions')

  if (checkCoverage) covStringArgs.unshift('--check-coverage')

  if (scr) {
    process.argv = [process.argv[0], c8, 'report', ...covStringArgs, ...covBooleanArgs]
  } else {
    const argv = [c8, ...covStringArgs, ...covBooleanArgs]
    process.argv.splice(1, 0, ...argv)
  }
  require(c8) // this actually starts cmd.mjs again in a subprocess

  await new Promise(() => {}) // block proceeding past this point
}

async function report (reporter) {
  switch (reporter.toLowerCase()) {
    case 'tap': return process.stdout
    case 'dot':
    case 'spec': {
      const { default: rep } = await import('tap-mocha-reporter')
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
    const [, key] = await once(process.stdin, 'keypress')
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

onExit(() => {
  process.stdout.write(esc.cursorShow)
  if (args['cov-report'] === 'html') open(join(args['cov-dir'], 'index.html'))
})
process.stdout.write(esc.cursorHide)

if (watch) {
  process.stdin.setRawMode(true)
  readline.emitKeypressEvents(process.stdin)
  process.stdin.on('keypress', async (ch, key) => {
    if (key.name === 'c' && key.ctrl) {
      process.stdout.write('\n')
      process.kill(process.pid, 'SIGINT')
    }
    if (ch === 'x') {
      process.stdout.write('\n')
      process.exit()
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
  const watcher = chokidar.watch(cwd, { ignoreInitial: true, ignored: /node_modules|coverage/, cwd: cwd })
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
  process.stdout.write('\n')
  if (watch) {
    process.stdout.write(`🥜 Watch mode on\n   Press ${bold('w')} to force reload\n   Press ${bold('r')} to change reporter\n `)
    process.stdout.write(`  Press ${bold('x')} to exit\n`)
  }
}
