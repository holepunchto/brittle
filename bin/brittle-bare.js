#!/usr/bin/env bare

if (!global.Bare && global.process) {
  const { status } = require('child_process').spawnSync('bare', process.argv.slice(1), { stdio: 'inherit', shell: true })
  process.exit(status)
}

require('../cmd.js')
