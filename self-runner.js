// provides a very light wrapper to allow brittle to test itself
process.env.BRITTLE_INTERNAL_LEVEL = 1
process.env.BRITTLE_INTERNAL_PROJECT_ROOT = require('pkg-dir').sync()