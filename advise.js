#!/usr/bin/env node
console.error(`
  Use brittle-bare or brittle-node

  Example: package.json scripts
  
  {
    "make:test": "brittle-make-test test/all.mjs test/*.test.js",
    "test": "npm run test:bare && npm run test:node",
    "test:bare": "brittle-bare -j 4 test/all.mjs",
    "test:node": "brittle-node test/all.mjs",
  }
  
`)
const { exit } = global.Bare ?? global.process
exit(1)
