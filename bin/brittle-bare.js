#!/usr/bin/env bare

if (!global.Bare && global.process) {
  process.exit(
    require('child_process')
      .spawnSync('bare', process.argv.slice(1), { stdio: 'inherit', shell: true })
      .status
  )
}

require('../cmd.js')
