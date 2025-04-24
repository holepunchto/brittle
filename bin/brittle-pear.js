#!/usr/bin/env pear

/* global Pear */
if (!global.Pear && global.process) {
  const { status } = require('child_process').spawnSync('pear', process.argv.slice(1), { stdio: 'inherit', shell: true })
  process.exit(status)
}

if (!Pear.run) throw new Error('Incompatible with current Pear version (must be v2+)')

require('../brittle/cmd.js')
