#!/usr/bin/env node

const path = require('path')

const args = (process.env.BRITTLE || '').split(/\s|,/g).map(s => s.trim())

for (const arg of process.argv) {
  if (arg[0] === '-') args.push(arg)
}

const cov = flag('coverage', 'cov')
const bail = flag('bail')
const solo = flag('solo')

process.title = 'brittle'

if (cov && process.env.BRITTLE_COVERAGE !== 'false') {
  const c8pkg = require('c8/package.json')
  const bin = c8pkg.bin ? path.join(path.dirname(require.resolve('c8/package.json')), c8pkg.bin) : null
  process.env.BRITTLE = (process.env.BRITTLE || '') + ' --no-coverage'
  process.argv.unshift(bin)
  process.argv.unshift(process.execPath)
  require(bin)
} else {
  start().catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
}

async function start () {
  if (bail || solo) {
    require('./').configure({ bail, solo })
  }

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('-')) continue
    await import('file://' + path.resolve(arg))
  }
}

function flag (...names) {
  for (const name of names) {
    if (args.includes('--no-' + name)) return false
    if (args.includes('--' + name)) return true
  }
  return undefined
}
