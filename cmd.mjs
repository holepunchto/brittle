#!/usr/bin/env node
import { resolve } from 'path'
import minimist from 'minimist'
import glob from 'glob'
import SonicBoom from 'sonic-boom'
import test, { configure } from './index.js'
import { kMain, kChildren, kLevel, kReset } from './lib/symbols.js'


const { _: files, reporter = 'tap' } = minimist(process.argv.slice(2), {
  strings: ['reporter'],
  alias: {reporter: ['R', 'r']}
})
const cwd = process.cwd()
const paths = [...new Set(files.flatMap((f) => glob.sync(f)).filter((f) => /\.(c|m)?js/.test(f)).map((f) => resolve(cwd, f)))]

if (paths.length === 0) process.exit()


async function report (reporter) {
  switch (reporter.toLowerCase()) {
    case 'tap': return new SonicBoom({fd: 1})
    case 'dot':
    case 'spec': {
      const {default: rep} = await import('tap-mocha-reporter')
      const transform = rep(reporter)
      return transform
    }
  }

}


const output = await report(reporter)
const main = test[kMain]
configure({ output, [kLevel]: 1 })

let index = 1
const start = process.hrtime.bigint()
output.write('TAP version 13')
for (const path of paths) {
  const start = process.hrtime.bigint()
  const title = path.slice(cwd.length + 1)
  output.write(`\n# ${title}\n`)
  await import(path)
  const results = await Promise.allSettled(main[kChildren])
  await main.end()
  main[kReset]()
  let summary = ''
  for (const { status, value } of results) {
    if (status !== 'fulfilled' || value.failing > 0) {
      summary = 'not '
      break
    }
  }
  summary += `ok ${index++} - ${title}`
  output.write(`${summary} # time=${(Number(process.hrtime.bigint() - start)) / 1e6}ms\n`)
}

output.write(`\n1..${index - 1}\n`)
output.write(`# time=${(Number(process.hrtime.bigint() - start)) / 1e6}ms\n`)
output.end()


// glob to collect files


// spawn each test, use -j for pool size, default 4


// output results fastest first?