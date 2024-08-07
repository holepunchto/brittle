#!/usr/bin/env node

const path = require('path')
const minimist = require('minimist')
const Globbie = require('globbie')

const args = process.argv.slice(2).concat((process.env.BRITTLE || '').split(/\s|,/g).map(s => s.trim()).filter(s => s))
const argv = minimist(args, {
  alias: {
    solo: 's',
    bail: 'b',
    coverage: 'cov',
    cov: 'c',
    runner: 'r'
  },
  boolean: ['solo', 'bail', 'coverage'],
  string: ['cov-dir']
})

const files = []
for (const g of argv._) {
  const glob = new Globbie(g, { sync: true })
  const matches = glob.match()

  if (matches.length === 0) {
    console.error(`Error: no files found when resolving ${g}`)
    process.exit(1)
  }

  files.push(...matches)
}

if (files.length === 0) {
  console.error('Error: No test files were specified')
  process.exit(1)
}

const { solo, bail, cov } = argv

process.title = 'brittle'

if (argv.runner) {
  const fs = require('fs')

  if (argv.runner === true) {
    console.error('--runner must be a path to the generated test runner')
    process.exit(2)
  }

  const out = path.resolve(argv.runner)
  const dir = path.dirname(out)

  let s = ''

  s += 'runTests()\n\nasync function runTests () {\n  const test = (await import(\'brittle\')).default\n\n'

  if (bail || solo) {
    s += '  test.configure({ bail: ' + !!bail + ', solo: ' + !!solo + ' })\n'
  }

  s += '  test.pause()\n\n'

  for (const f of files) {
    const t = path.resolve(f)
    if (t === out) continue

    let r = path.relative(dir, t)
    if (r[0] !== '.') r = '.' + path.sep + r
    s += '  await import(\'' + r + '\')\n'
  }

  s = s.trimRight()

  s += '\n\n  test.resume()\n}\n'
  s = '// This runner is auto-generated by Brittle\n\n' + s

  try {
    fs.mkdirSync(dir)
  } catch {}

  fs.writeFileSync(out, s)
  process.exit(0)
}

if (cov && process.env.BRITTLE_COVERAGE !== 'false') require('bare-cov')({ dir: argv['cov-dir'] })

start().catch(err => {
  console.error(err.stack)
  process.exit(1)
})

async function start () {
  const brittle = require('./')

  if (bail || solo) {
    brittle.configure({ bail, solo })
  }

  brittle.pause()

  for (const f of files) {
    await import('file://' + path.resolve(f))
  }

  brittle.resume()
}
