require('yaml').scalarOptions.str.fold.lineWidth = Infinity // CI tap-yaml output compatibility
process.env.BRITTLE_INTERNAL_PROJECT_ROOT = require('pkg-dir').sync()
process.env.BRITTLE_INTERNAL_LEVEL = 0
process.env.BRITTLE_TIMEOUT = 60000


if (process.env.TEST_EMULATE_SIGINT) setTimeout(() => {
  process.emit('SIGINT')
}, process.env.TEST_EMULATE_SIGINT) 