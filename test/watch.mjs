import { watcher } from './helpers/index.js'

await watcher('watch - runs on start', async function (w) {
  await w.waitForDone()
  w.ok(w.output.includes('# ok'), 'initial run passed')
})

await watcher('watch - re-runs exactly once on file change', async function (w) {
  await w.waitForDone()
  w.resetOutput()

  w.write('v2')

  await w.waitForDone()

  w.is((w.output.match(/--- File changed/g) || []).length, 1, 'exactly one re-run triggered')
  w.ok(w.output.includes('# ok'), 're-run passed')
})

await watcher('watch - re-runs all files when one changes', async function (w) {
  await w.waitForDone()
  w.resetOutput()

  w.write('v2')

  await w.waitForDone()

  w.ok(w.output.includes('# ok'), 're-ran all tests on change')
})

await watcher('watch - no re-run without file change', async function (w) {
  await w.waitForDone()
  w.resetOutput()

  await new Promise(function (resolve) { setTimeout(resolve, 500) })

  w.is(w.output, '', 'no output without a file change')
})
