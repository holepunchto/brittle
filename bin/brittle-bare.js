#!/usr/bin/env bare

if (!global.Bare && global.process) {
  process.exit(
    require('child_process')
      .spawnSync(
        require('bare-which').sync('bare'),
        process.argv.slice(1),
        { stdio: 'inherit' }
      ).status
  )
}

require('../cmd.js')
