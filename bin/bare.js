#!/bin/sh
':' // ; command -v bare >/dev/null && exec bare "$0" "$@" || exec node "$0" "$@"
/* global Bare */
const isNode = typeof Bare === 'undefined' && typeof process !== 'undefined'
if (isNode) {
  const Sidecar = require('bare-sidecar')
  const fs = require('fs')
  const sidecar = new Sidecar(fs.realpathSync(__filename), process.argv.slice(2))
  process.stdin.pipe(sidecar.stdin)
  sidecar.stdout.pipe(process.stdout)
  sidecar.stderr.pipe(process.stderr)
  sidecar.on('exit', (code) => process.exit(code))
} else {
  if (Bare.IPC) Bare.IPC.unref()
  require('../cmd.js')
}
