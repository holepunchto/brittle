#!/usr/bin/env bare
const { isNode, isWindows } = require('which-runtime')
const { spawnSync } = require('child_process')
if (isNode) {
  const ext = isWindows ? '.exe' : ''
  const { status } = spawnSync('bare' + ext, process.argv.slice(1), { stdio: 'inherit' })
  process.exit(status)
}
require('./cmd.js')

