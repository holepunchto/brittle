#!/usr/bin/env bare
const os = require('os')
const { isNode, isWindows } = require('which-runtime')
const { spawn, spawnSync } = require('child_process')
const process = require('process')

const exposeGc = hasExposeGc()

if (isNode) {
  const ext = isWindows ? '.exe' : ''
  const args = exposeGc ? ['--expose-gc', ...process.argv.slice(1)] : process.argv.slice(1)
  const { status } = spawnSync('bare' + ext, args, { stdio: 'inherit' })
  process.exit(status ?? 1)
}

if (exposeGc && typeof gc !== 'function') {
  const args = ['--expose-gc', ...process.argv.slice(1)]
  const child = spawn(process.execPath, args, { stdio: 'inherit' })
  const signals = ['SIGINT', 'SIGTERM']
  const onsignal = (signal) => child.kill(signal)

  for (const signal of signals) process.on(signal, onsignal)

  child.once('exit', (code, signal) => {
    for (const signal of signals) process.off(signal, onsignal)

    if (signal) {
      process.exitCode = 0x80 | os.constants.signals[signal]
    } else {
      process.exitCode = code ?? 1
    }
  })
} else {
  require('./cmd.js')
}

function hasExposeGc() {
  const args = (process.env.BRITTLE || '')
    .split(/\s|,/g)
    .map((s) => s.trim())
    .filter((s) => s)
    .concat(process.argv.slice(2))

  let expose = false
  for (const arg of args) {
    if (arg === '--') break
    if (arg === '--expose-gc') expose = true
    else if (arg === '--no-expose-gc') expose = false
  }
  return expose
}
