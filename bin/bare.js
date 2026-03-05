#!/bin/sh
':' // ; exec bare "$0" "$@" 2>/dev/null || exec node "$0" "$@"
const isNode = !global.Bare && global.process
if (isNode) {
  const Sidecar = require('bare-sidecar')
  const fs = require('fs')
  const sidecar = new Sidecar(fs.realpathSync(__filename), process.argv.slice(2))
  process.stdin.pipe(sidecar.stdin)
  sidecar.stdout.pipe(process.stdout)
  sidecar.stderr.pipe(process.stderr)
  sidecar.on('exit', (code) => process.exit(code))
} else {
  Bare.IPC.unref()
  require('../cmd.js')
}