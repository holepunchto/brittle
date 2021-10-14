#!/usr/bin/env node
import { realpath } from 'fs/promises'
import { createRequire } from 'module'
import { on, once } from 'events'
import { pathToFileURL } from 'url'
import readline from 'readline'
import { join, resolve } from 'path'
import minimist from 'minimist'
import glob from 'glob'
import chokidar from 'chokidar'
import { bold, dim, underline } from 'colorette'
import esc from 'ansi-escapes'
import onExit from 'signal-exit'
import sleep from 'atomic-sleep'
import Menu from 'menu-string'
import open from 'open'
import pkgDir from 'pkg-dir'
import ciInfo from 'ci-info'
import test, { configure } from './index.js'
import usage, { covUsage } from './usage.mjs'
import ss from 'snap-shot-core'
import { kMain, kChildren, kLevel, kReset, kSnap } from './lib/symbols.js'

const { NODE_V8_COVERAGE, FORCE_TTY } = process.env
const CI = ciInfo.isCI
const argv = process.argv.slice(2)
const args = minimist(argv, {
  strings: ['reporter', 'cov-exclude', 'cov-include', 'cov-all', 'cov-dir', 'cov-reporter', 'cov-clean', 'lines', 'functions', 'statements', 'branches', 'snap'],
  boolean: ['watch', 'bail', '100', '90', '85', 'cov', 'cov-skip-full', 'cov-per-file', 'show-cov-report', 'help', '--cov-help', 'snap-all', 'ec', 'solo'],
  default: {
    cov: true,
    bail: false,
    watch: false,
    reporter: 'tap',
    'cov-clean': true,
    'cov-dir': join(await pkgDir(), 'coverage')
  },
  alias: {
    help: ['h'],
    reporter: ['R', 'r'],
    watch: ['w'],
    ec: ['e'],
    bail: ['b'],
    'cov-report': ['cov-reporter'],
    'show-cov-report': ['scr']
  }
})

if (args.ec) args['cov-report'] = args['cov-reporter'] = 'html'
if (args.bail) args.cov = false

const cwd = process.cwd()
const advisements = []
const normalizeToFilePath = (f) => {
  try { return fileURLToPath(f)  } catch { return f }
}

if (process.stdout.isTTY || FORCE_TTY) process.stdout.write(esc.cursorHide)

onExit(() => {
  if (process.stdout.isTTY || FORCE_TTY) process.stdout.write(esc.cursorShow)
  if (!NODE_V8_COVERAGE) {
    if (args['cov-report'] === 'html') open(join(args['cov-dir'], 'index.html'))
  }
})

const { _: files, cov, scr, bail } = args

if (args.help) {
  process.stdout.write(usage)
  process.exit()
}
if (args['cov-help']) {
  process.stdout.write(covUsage)
  process.exit()
}

if (args['snap-all']) {
  process.env.SNAP = 1
} else if (args.snap) {
  process.env.SNAP = args.snap
}

if (args.solo) process.env.SOLO = 1

let { reporter, watch } = args
if (CI) {
  watch = false
  reporter = 'tap'
}

const paths = [...new Set(files.flatMap((f) => glob.sync(f)).filter((f) => /\.(c|m)?js/.test(f)).map((f) => pathToFileURL(resolve(cwd, f)).href))]

if (!scr && paths.length === 0) {
  console.error('Brittle: Specify one or more test paths')
  process.stdout.write(usage)
  process.exit()
}

if (cov === true && (!NODE_V8_COVERAGE || scr)) {
  const require = createRequire(import.meta.url)
  const { bin } = require('c8/package.json')
  const c8 = require.resolve(`c8/${bin.c8 || bin}`)
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

async function manageSnapshots () {
  if (advisements.length === 0) return
  const items = advisements.map(({ specName, file }) => {
    return {
      text: `${specName} (${normalizeToFilePath(file).replace(cwd, '').slice(1)})`,
      specName,
      file
    }
  })
  const top = [ { text: 'Back', cmd: 'back' }, { text: 'All', cmd: 'all' }, { text: '===========', separator: true }]
  const menu = new Menu({
    items: [...top, ...items],
    render (item, selected) {
      const label = item.text
      return selected ? `   🥜 ${label}` : `      ${label}`
    }
  })
  process.stdout.write(`\n📸 Select a snapshot to ${underline('update')}\n\n`)
  process.stdout.write(menu.toString() + '\n')
  while (true) {
    const [, key] = await once(process.stdin, 'keypress')
    if (key.name === 'up') menu.up()
    if (key.name === 'down') menu.down()
    if (key.name === 'return' || key.name === 'enter') {
      const selected = menu.selected()
      if (selected.cmd === 'back') {
        process.stdout.write(esc.eraseLines(menu.items.length + 4))
        break
      } else if (selected.cmd === 'all') {
        test[kMain][kSnap] = true
      } else {
        test[kMain][kSnap] = selected.specName
      }
      await run(true)
      test[kMain][kSnap] = false
      break
    }
    process.stdout.write(esc.cursorUp(menu.items.length))
    process.stdout.write(menu.toString() + '\n')
  }
}

if (watch) {
  process.stdout.write(esc.cursorSavePosition)
  process.stdin.setRawMode(true)
  readline.emitKeypressEvents(process.stdin)
  process.stdin.on('keypress', async (ch, key) => {
    if (key.name === 'c' && key.ctrl) {
      process.kill(process.pid, 'SIGINT')
    }
    if (ch === 'x') {
      if (cov) process.stdout.write('\nGenerating coverage report...\n')
      else process.stdout.write('\nExiting...\n')
      process.exit()
    }
    try {
      if (ch === 's') await manageSnapshots()
      if (ch === 'w') await run(true)
      if (ch === 'r') await selectReporter()
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  })
}

await run()

if (watch) {
  const watcher = chokidar.watch(cwd, { ignoreInitial: true, ignored: /node_modules|coverage|__snapshots__/, cwd: cwd })
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
  advisements.length = 0
  const output = await report(reporter)
  let failing = 0
  const main = test[kMain]
  main.runner = true
  main[kReset]()
  configure({ output, [kLevel]: 1, bail })
  let index = 1
  const start = process.hrtime.bigint()
  output.write('TAP version 13')
  for (const path of paths) {
    const start = process.hrtime.bigint()
    const title = path.slice(cwd.length + 8)
    output.write(`\n# ${title}\n`)
    await import(`${path}?cacheBust=${Date.now()}`)
    const results = await Promise.allSettled(main[kChildren])
    failing += results.reduce((sum, { value }) => sum + value.failing, 0)
    await main.end()
    ss.restore()
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
  if (failing > 0) output.write(`# failing=${failing}\n`)

  if (!watch) output.write(main.advice.join(''))
  advisements.push(...main.advice.filter((adv) => typeof adv === 'object'))
  main.advice.length = 0
  if (output !== process.stdout) output.end()
  main.end()
  main[kReset]()
  process.stdout.write('\n')
  if (watch) {
    process.stdout.write(`🥜 Watch mode on\n   Press ${bold('w')} to force reload\n   Press ${bold('r')} to change reporter\n `)
    if (advisements.length > 0) process.stdout.write(`  Press ${bold('s')} to manage snapshots\n `)
    process.stdout.write(`  Press ${bold('x')} to exit\n`)
  }
}