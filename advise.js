#!/usr/bin/env node
console.error(`
  Use brittle-bare or brittle-node

  Example: package.json scripts
  
  {
    "make:test": "brittle-make-test test/index.js test/*.test.js",
    "test": "npm run test:bare && npm run test:node",
    "test:bare": "brittle-bare test",
    "test:node": "brittle-node test"
  }
  
`)
const { exit } = global.Bare ?? global.process
exit(1)
