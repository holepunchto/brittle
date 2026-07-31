const fs = require('fs')
const path = require('path')
const process = require('process')
const { spawn } = require('child_process')
const ansi = require('bare-ansi-escapes')

const DEBOUNCE = 200
const REARM = 50

const TALLY = /^# (tests|asserts) = (\d+)\/(\d+) pass$/

exports.watch = watch

// exported for tests
exports.decodeKeys = decodeKeys
exports.selectFiles = selectFiles
exports.summaryLine = summaryLine
exports.parseTally = parseTally
exports.toPattern = toPattern
exports.nothingToRun = nothingToRun

function watch({ cmd, files, args, color }) {
  const style = createStyle(color)
  const interactive = process.stdin?.isTTY === true

  const state = {
    mode: 'all',
    pattern: null,
    failed: new Set(),
    changed: new Set(),
    prompt: null
  }

  const watchers = []
  const seen = new Map()
  let debounce = null
  let current = null
  let token = 0
  let closed = false

  for (const file of files) arm(file)

  if (interactive) {
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', onstdin)
  } else {
    process.on('SIGINT', quit)
  }

  run('initial run')

  function arm(file) {
    let watcher

    // record the current mtime up front: the platform can deliver a stale event
    // for a write that happened before the watcher existed
    unchanged(file)

    try {
      watcher = fs.watch(file, (type) => {
        // an atomic save replaces the inode, so the old handle is now watching
        // a file that no longer exists
        if (type === 'rename') {
          watcher.close()
          setTimeout(() => {
            if (!closed) arm(file)
          }, REARM)
        }

        // a single save can surface as several events (truncate then write), so
        // ignore any that did not move the mtime
        if (unchanged(file)) return

        state.changed.add(file)
        trigger(path.relative(process.cwd(), file) + ' changed')
      })
    } catch {
      write(style.yellow('! cannot watch ' + file))
      return
    }

    watchers.push(watcher)
  }

  function unchanged(file) {
    let mtime

    try {
      mtime = fs.statSync(file).mtimeMs
    } catch {
      return false // mid-save, let the run decide
    }

    if (seen.get(file) === mtime) return true

    seen.set(file, mtime)
    return false
  }

  function trigger(reason) {
    if (closed) return
    clearTimeout(debounce)
    debounce = setTimeout(() => run(reason), DEBOUNCE)
  }

  async function run(reason) {
    const mine = ++token

    if (current) {
      current.kill()
      current = null
    }

    const selected = selectFiles(state, files)

    clear()
    write(style.dim('brittle watch — ' + reason))
    write('')

    if (selected.length === 0) {
      write(style.yellow(nothingToRun(state)))
      write('')
      usage()
      return
    }

    const started = Date.now()
    const failed = []
    const tests = { pass: 0, count: 0 }
    const asserts = { pass: 0, count: 0 }

    for (const file of selected) {
      if (mine !== token) return

      const relative = path.relative(process.cwd(), file)
      write(style.dim('── ' + relative + ' ' + '─'.repeat(Math.max(0, 60 - relative.length))))

      const result = await runFile(file, tests, asserts)

      if (mine !== token) return

      if (result.ok) {
        write(style.badgePass(' PASS ') + ' ' + relative + style.dim(' ' + result.duration + 'ms'))
      } else {
        failed.push(file)
        write(style.badgeFail(' FAIL ') + ' ' + relative + style.dim(' ' + result.duration + 'ms'))
      }

      write('')
    }

    state.failed = new Set(failed)
    state.changed.clear()

    summary({ selected, failed, tests, asserts, duration: Date.now() - started })
    usage()
  }

  function runFile(file, tests, asserts) {
    return new Promise((resolve) => {
      const started = Date.now()
      const child = spawn(process.execPath, [cmd, ...args, file], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe']
      })

      current = child

      lines(child.stdout, (line) => {
        const tally = parseTally(line)

        if (tally) {
          const target = tally.kind === 'tests' ? tests : asserts
          target.pass += tally.pass
          target.count += tally.count
        }

        write(line)
      })

      lines(child.stderr, (line) => write(style.red(line)))

      child.on('error', (error) => {
        write(style.red(error.message))
      })

      child.on('close', (code, signal) => {
        if (current === child) current = null
        resolve({ ok: code === 0 && !signal, duration: Date.now() - started })
      })
    })
  }

  function summary({ selected, failed, tests, asserts, duration }) {
    const files = {
      failed: failed.length,
      passed: selected.length - failed.length,
      total: selected.length
    }

    write(style.count('Files', files))
    write(style.count('Tests', counts(tests)))
    write(style.count('Asserts', counts(asserts)))
    write(style.dim('Time:    ' + (duration / 1000).toFixed(2) + 's'))

    if (failed.length > 0) {
      write('')
      write(style.boldRed('Failed files:'))
      for (const file of failed) {
        write(style.red('  - ' + path.relative(process.cwd(), file)))
      }
    }

    write('')
  }

  function usage() {
    if (!interactive) {
      write(style.dim('Watching ' + files.length + ' file(s) for changes — ctrl-c to exit.'))
      return
    }

    if (state.prompt !== null) {
      write(style.bold('Filter by filename regex') + style.dim(' (enter to apply, esc to cancel)'))
      write(' › ' + state.prompt)
      return
    }

    const active = []
    if (state.mode === 'failed') active.push('failed only')
    if (state.mode === 'changed') active.push('changed only')
    if (state.pattern) active.push('/' + state.pattern.source + '/')

    write(style.bold('Watch Usage'))
    write(style.dim(' › Press ') + 'a' + style.dim(' to run all tests.'))
    write(style.dim(' › Press ') + 'f' + style.dim(' to run only failed files.'))
    write(style.dim(' › Press ') + 'o' + style.dim(' to run only changed files.'))
    write(style.dim(' › Press ') + 'p' + style.dim(' to filter by a filename regex.'))
    write(style.dim(' › Press ') + 'q' + style.dim(' to quit watch mode.'))
    write(style.dim(' › Press ') + 'enter' + style.dim(' to trigger a test run.'))

    if (active.length > 0) write(style.dim(' › Active filters: ') + active.join(', '))
  }

  function onstdin(chunk) {
    for (const key of decodeKeys(chunk)) {
      if (state.prompt !== null) {
        onprompt(key)
        continue
      }

      if (key.ctrl && key.name === 'c') return quit()

      switch (key.name) {
        case 'q':
          return quit()
        case 'a':
          state.mode = 'all'
          state.pattern = null
          return run('running all tests')
        case 'f':
          state.mode = 'failed'
          return run('running failed files')
        case 'o':
          state.mode = 'changed'
          return run('running changed files')
        case 'p':
          state.prompt = ''
          clear()
          usage()
          continue
        case 'return':
          return run('manual run')
        default:
          continue
      }
    }
  }

  function onprompt(key) {
    if (key.ctrl && key.name === 'c') return quit()

    if (key.name === 'escape') {
      state.prompt = null
      clear()
      usage()
      return
    }

    if (key.name === 'return') {
      const pattern = toPattern(state.prompt)
      state.prompt = null

      if (pattern === null) {
        clear()
        write(style.red('Not a valid regex.'))
        write('')
        usage()
        return
      }

      state.pattern = pattern
      state.mode = 'all'
      run(pattern ? 'filtering by /' + pattern.source + '/' : 'filter cleared')
      return
    }

    if (key.name === 'backspace') {
      state.prompt = state.prompt.slice(0, -1)
    } else if (key.name.length === 1 && !key.ctrl) {
      state.prompt += key.name
    }

    clear()
    usage()
  }

  function quit() {
    if (closed) return
    closed = true

    clearTimeout(debounce)
    for (const watcher of watchers) watcher.close()
    if (current) current.kill()

    if (interactive) {
      process.stdin.off('data', onstdin)
      process.stdin.setRawMode(false)
      process.stdin.pause()
    }

    write('')
  }

  function clear() {
    if (interactive) process.stdout.write(ansi.eraseDisplay + ansi.cursorPosition(0, 0))
  }
}

function nothingToRun({ mode, pattern }) {
  if (mode === 'failed') return 'No failed files. Press a to run all tests.'
  if (mode === 'changed') return 'No files have changed yet. Press a to run all tests.'
  if (pattern) return 'No test files match /' + pattern.source + '/. Press a to clear the filter.'
  return 'No test files to run.'
}

function counts({ pass, count }) {
  return { failed: count - pass, passed: pass, total: count }
}

function summaryLine(label, { failed, passed, total }) {
  const parts = []
  if (failed > 0) parts.push(failed + ' failed')
  parts.push(passed + ' passed')
  parts.push(total + ' total')

  return (label + ':').padEnd(8) + ' ' + parts.join(', ')
}

function parseTally(line) {
  const match = TALLY.exec(line.trim())
  if (match === null) return null

  return { kind: match[1], pass: Number(match[2]), count: Number(match[3]) }
}

// '' clears the filter, an invalid regex returns null
function toPattern(input) {
  if (input === '') return false

  try {
    return new RegExp(input)
  } catch {
    return null
  }
}

function decodeKeys(chunk) {
  const data = chunk.toString()
  const keys = []

  for (let i = 0; i < data.length; i++) {
    const c = data[i]

    if (c === '\x1b') {
      // consume an escape sequence so that arrow keys are not read as letters
      if (data[i + 1] === '[' || data[i + 1] === 'O') {
        i += 2
        while (i < data.length && !/[A-Za-z~]/.test(data[i])) i++
        keys.push({ name: 'unknown', ctrl: false })
      } else {
        keys.push({ name: 'escape', ctrl: false })
      }
      continue
    }

    if (c === '\r' || c === '\n') keys.push({ name: 'return', ctrl: false })
    else if (c === '\x7f' || c === '\b') keys.push({ name: 'backspace', ctrl: false })
    else if (c < ' ') keys.push({ name: String.fromCharCode(c.charCodeAt(0) + 96), ctrl: true })
    else keys.push({ name: c, ctrl: false })
  }

  return keys
}

function selectFiles({ mode, pattern, failed, changed }, files) {
  let selected = files

  if (mode === 'failed') selected = selected.filter((file) => failed.has(file))
  else if (mode === 'changed') selected = selected.filter((file) => changed.has(file))

  if (pattern) selected = selected.filter((file) => pattern.test(file))

  return selected
}

function lines(stream, onLine) {
  let buffer = ''

  stream.setEncoding('utf-8')
  stream.on('data', (chunk) => {
    buffer += chunk

    while (true) {
      const at = buffer.indexOf('\n')
      if (at === -1) break
      onLine(buffer.slice(0, at))
      buffer = buffer.slice(at + 1)
    }
  })

  stream.on('end', () => {
    if (buffer !== '') onLine(buffer)
  })
}

function write(line) {
  console.log(line)
}

function createStyle(color) {
  const paint = (open) => (string) => (color ? open + string + ansi.modifierReset : string)

  const dim = paint(ansi.modifierDim)
  const bold = paint(ansi.modifierBold)
  const red = paint(ansi.colorRed)
  const green = paint(ansi.colorGreen)
  const yellow = paint(ansi.colorYellow)
  const boldRed = paint(ansi.modifierBold + ansi.colorRed)

  return {
    dim,
    bold,
    red,
    green,
    yellow,
    boldRed,
    badgePass: paint(ansi.modifierBold + ansi.colorBlack + ansi.constants.SGR(42)),
    badgeFail: paint(ansi.modifierBold + ansi.colorWhite + ansi.constants.SGR(41)),
    count(label, values) {
      const line = summaryLine(label, values)
      return values.failed > 0 ? boldRed(line) : green(line)
    }
  }
}
