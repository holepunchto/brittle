import { on } from 'events'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join, resolve, sep } from 'path'
import { promisify } from 'util'
import { spawn } from 'child_process'
import { test } from '../index.js'
import pty from 'node-pty-prebuilt-multiarch'
const testDir = fileURLToPath(dirname(import.meta.url))
const fixtures = join(testDir, 'fixtures')
const fixturesRx = new RegExp(fixtures, 'g')
const project = resolve(testDir, '..')
const dirRx = new RegExp(project + sep, 'g')
const cmd = resolve(project, 'cmd.mjs')
const fixture = (file) => join(fixtures, file)
const clean = (str) => {
  return str
    .replace(/(time=).*(ms)/g, '$11.3371337$2') // generalize timestamps
    .replace(fixturesRx, '') // remove fixture call frames
    .replace(dirRx, '') // remove project dir occurrences
    .replace(/.+\(internal\/.+\n/gm, '') // remove node call frames
    .replace(/.+\ at.+(node:)?internal\/.+\n/gm, '') // remove node call frames
    .replace(/.+\(((?!\/).+)\)\n/gm, '') // remove node call frames
    .replace(/:\d+:\d+/g, ':13:37') // generalize column:linenumber
}
const run = promisify(async (args, cb) => {
  let opts = { env: { ...process.env, FORCE_COLOR: 1, FORCE_TTY: 1} }
  if (Array.isArray(args) === false) {
    opts.env = { ...opts.env, ...(args.env || {})}
    [ args, opts ] = [ opts.args, { ...args } ]
  }
  const sp = spawn(process.execPath, [cmd, ...args], { stdio: ['pipe', 'pipe', 'pipe'], ...opts })
  const stdout = []
  const stderr = []
  sp.stdout.setEncoding('utf-8')
  sp.stderr.setEncoding('utf-8')
  sp.stdout.on('data', (chunk) => stdout.push(chunk))
  sp.stderr.on('data', (chunk) => stderr.push(chunk))
  sp.stdout.on('end', (chunk) => { if (chunk) stdout.push(chunk) })
  sp.stderr.on('end', (chunk) => { if (chunk) stderr.push(chunk) })
  sp.on('close', (code) => {
    const out = clean(stdout.join(''))
    cb(null, { stdout: out, stderr: clean(stderr.join('')), code, [Symbol.toPrimitive] () { return out } })
  })
})

const term = promisify(({ args, ctrlC = true, autoExit = false, ready }, cb) => {
  const shell = process.platform === 'win32' ? 'powershell.exe' : (process.platform === 'darwin' ? 'zsh' : 'bash')
  const terminal = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: testDir,
    env: process.env
  })
  let output = ''
  let timeout = null
  const finalize = () => {
    if (autoExit) {
      terminal.onExit(() => {
        cb(null, { out() { return on(terminal, 'data') }, output: clean(output).replace(/[^]*(\x1B\[\?2004l)/m, '$1'), terminal })
      })
      if (ctrlC !== false) terminal.write('\x03')
      terminal.kill()
    } else {
      const exited = promisify((cb) => {
        terminal.onExit((meta) => { cb(null, meta)})
      })()
      cb(null, { out() { return on(terminal, 'data') }, get output () { return clean(output).replace(/[^]*(\x1B\[\?2004l)/m, '$1')  }, terminal, exited })
    }
  }

  if (!ready && !autoExit) {
    const exited = promisify((cb) => {
      terminal.onExit((meta) => { cb(null, meta)})
    })()
    cb(null, { out() { return on(terminal, 'data') } , terminal, exited })
  } else {
    terminal.onData((data) => {
      clearTimeout(timeout)
      output += data
      if (!ready.match) timeout = setTimeout(() => finalize(), ready.wait)
      else if (ready.match.test(data)) finalize()
    })
  }

  terminal.write([process.execPath, cmd, ...args, '\r'].join(' '))
})

test('no args', async ({ is, snapshot }) => {
  const result = await run([])
  is(result.code, 0)
  snapshot(result.stdout)
})

test('--help', async ({ is, snapshot }) => {
  {
    const result = await run(['-h'])
    is(result.code, 0)
    snapshot(result.stdout)
  }
  {
    const result = await run(['--help'])
    is(result.code, 0)
    snapshot(result.stdout)
  }
})

test('--cov-help', async ({ is, snapshot }) => {
  const result = await run(['--cov-help'])
  is(result.code, 0)
  snapshot(result.stdout)
})

test('single passing test', async ({ is, snapshot }) => {
  const result = await run([fixture('classic-pass.js'), '--no-cov'])
  is(result.code, 0)
  snapshot(result.stdout)
})

test('multiple specified passing tests', async ({ is, snapshot }) => {
  const result = await run([ '--no-cov', fixture('classic-pass.js'), fixture('inverted-pass.js')])
  is(result.code, 0)
  snapshot(result.stdout)
})

test('multiple globbed passing tests', async ({ is, snapshot }) => {
  const result = await run([ '--no-cov', fixture('*-pass.js')])
  is(result.code, 0)
  snapshot(result.stdout)
})

test('single failing test', async ({ is, snapshot }) => {
  const result = await run([fixture('classic-fail.js'), '--no-cov'])
  is(result.code, 1)
  snapshot(result.stdout)
})

test('multiple failing tests', async ({ is, snapshot }) => {
  const result = await run([ '--no-cov', fixture('classic-fail.js'), fixture('inverted-fail.js')])
  is(result.code, 1)
  snapshot(result.stdout)
})

test('passing and failing tests', async ({ is, snapshot }) => {
  const result = await run([ '--no-cov', fixture('classic-fail.js'), fixture('inverted-pass.js')])
  is(result.code, 1)
  snapshot(result.stdout)
})

await test('--reporter dot', async ({ is, snapshot }) => {
  {
    const result = await run([ '--no-cov', '--reporter', 'dot', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
  {
    const result = await run([ '--no-cov', '-r', 'dot', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
  {
    const result = await run([ '--no-cov', '-R', 'dot', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
})

await test('--reporter spec', async ({ is, snapshot }) => {
  {
    const result = await run([ '--no-cov', '--reporter', 'spec', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
  {
    const result = await run([ '--no-cov', '-r', 'spec', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
  {
    const result = await run([ '--no-cov', '-R', 'spec', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
})


await test('--reporter tap', async ({ is, snapshot }) => {
  {
    const result = await run([ '--no-cov', '--reporter', 'tap', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
  {
    const result = await run([ '--no-cov', '-r', 'tap', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
  {
    const result = await run([ '--no-cov', '-R', 'tap', fixture('classic-fail.js'), fixture('inverted-pass.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
})

await test('--bail', async ({ is, snapshot }) => {
  {
    const result = await run([ '--bail', fixture('should-bail.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }
  {
    const result = await run([ '--bail', fixture('should-bail.js')])
    is(result.code, 1)
    snapshot(result.stdout)
  }

})

await test('enter watch mode, ctrl + c exit', async ({ snapshot }) => {
  const { output } = await term({
    args: [ '--no-cov', '--watch', fixture('*-pass.js')],
    ready: { match: /to exit/ },
    autoExit: true
  })
  snapshot(output)
})

await test('enter watch mode, x to exit', async ({ snapshot }) => {
  const result = await term({
    args: [ '--no-cov', '--watch', fixture('*-pass.js')],
    ready: { match: /to exit/ },
  })
  const { terminal } = result
  terminal.write('x')
  await result.out().next()
  snapshot(result.output)
  terminal.kill()  
})

await test('watch mode, force reload', async ({ snapshot }) => {
  const result = await term({
    args: [ '--no-cov', '--watch', fixture('*-pass.js')],
    ready: { match: /to exit/ },
  })
  const { terminal } = result
  const out = result.out()
  terminal.write('w')
  await out.next()
  await out.next()
  for await (const [ s ] of out) if (/to exit/.test(s)) break
  snapshot(result.output)
  terminal.kill()  
})

await test('watch mode, reload from file change', async ({ snapshot }) => {
  const result = await term({
    args: [ '--no-cov', '--watch', fixture('*-pass.js')],
    ready: { match: /to exit/ },
  })
  const { terminal } = result
  await writeFile(fixture('classic-pass.js'), await readFile(fixture('classic-pass.js')))
  for await (const [ out ] of result.out()) if (/to exit/.test(out)) break
  snapshot(result.output)
  terminal.kill()  
})

await test('watch mode, select dot reporter', async ({ plan, snapshot, teardown }) => {
  const result = await term({
    args: [ '--no-cov', '--watch', fixture('*-pass.js')],
    ready: { match: /to exit/ },
  })
  plan(1)
  teardown(async () => {
    terminal.write('\x03')
    terminal.kill()
  })
  const { terminal } = result
  terminal.write('r')
  for await (const [ out ] of result.out()) if (/spec/.test(out)) break
  terminal.write('\x1B[B')
  const a = terminal.onData(() => {    
    terminal.write('\r')
    a.dispose()
    const b = terminal.onData((data) => {
      if (/to exit/.test(data)) {
        b.dispose()
        snapshot(clean(result.output.replace(/\(\d+\.\d+ms\)/, '13.37ms')))
      }
    })
  })
})

await test('watch mode, select spec reporter', async ({ plan, snapshot, teardown }) => {
  const result = await term({
    args: [ '--no-cov', '--watch', fixture('*-pass.js')],
    ready: { match: /to exit/ },
  })
  plan(1)
  teardown(async () => {
    terminal.write('\x03')
    terminal.kill()
  })
  const { terminal } = result
  terminal.write('r')
  for await (const [ out ] of result.out()) if (/spec/.test(out)) break
  terminal.write('\x1B[B')
  const a = terminal.onData(() => {    
    a.dispose()
    terminal.write('\x1B[B')
    const b = terminal.onData(() => {    
      terminal.write('\r')
      b.dispose()
      const c = terminal.onData((data) => {
        if (/to exit/.test(data)) {
          c.dispose()
          snapshot(clean(result.output.replace(/\(\d+\.\d+ms\)/, '13.37ms')))
        }
      })
    })
  })
})
