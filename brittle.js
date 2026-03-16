#!/bin/sh
':' // ; exec sh "$(cd "$(dirname "$0")" && pwd -P)/brittle.sh" "$0" "$@"
const isNode = typeof Bare === 'undefined' && typeof process !== 'undefined' && global.process.argv.includes('--node') === false
if (isNode) {
  const Sidecar = require('bare-sidecar')
  const fs = require('fs')
  const sidecar = new Sidecar(fs.realpathSync(__filename), process.argv.slice(2))
  process.stdin.pipe(sidecar.stdin)
  sidecar.stdout.pipe(process.stdout)
  sidecar.stderr.pipe(process.stderr)
  sidecar.on('exit', (code) => process.exit(code))
} else {
  if (global.Bare && global.Bare.IPC) global.Bare.IPC.unref()
  require('./cmd.js')
}
