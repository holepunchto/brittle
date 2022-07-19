#!/usr/bin/env node

const path = require('path')

process.title = 'brittle'

start()

async function start () {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('-')) continue
    await import(path.resolve(arg))
  }
}
