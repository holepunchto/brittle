#!/bin/sh
':' // ; exec sh "$(cd "$(dirname "$0")" && pwd -P)/brittle.sh" "$0" "$@"
const isNode = typeof Bare === 'undefined' && typeof process !== 'undefined'
if (isNode) {
  const { command, flag, sloppy, rest } = require('paparam')
  const args = (process.env.BRITTLE || '').split(/\s|,/g).map(s => s.trim()).filter(s => s).concat(process.argv.slice(2))
  const cmd = command('brittle',
    flag('--runtime [node|bare|included-bare]'),
    sloppy(),
    rest()
  ).parse(args)
  if (!cmd) process.exit(0)
  if (cmd.flags.runtime === 'node') {
    require('./cmd.js')
  } else {
    const Sidecar = require('bare-sidecar')
    const fs = require('fs')
    const sidecar = new Sidecar(fs.realpathSync(__filename), process.argv.slice(2))
    process.stdin.pipe(sidecar.stdin)
    sidecar.stdout.pipe(process.stdout)
    sidecar.stderr.pipe(process.stderr)
    sidecar.on('exit', (code) => process.exit(code))
  }
} else {
  if (global.Bare.IPC) global.Bare.IPC.unref()
  require('./cmd.js')
}
