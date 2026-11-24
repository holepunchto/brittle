#!/usr/bin/env node
const { spawnSync } = require('child_process')
const process = require('process')

if (hasExposeGc() && typeof gc !== 'function') {
  const args = [...process.execArgv, '--expose-gc', ...process.argv.slice(1)]
  const { status } = spawnSync(process.execPath, args, { stdio: 'inherit' })
  process.exit(status ?? 1)
}

require('./cmd.js')

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
