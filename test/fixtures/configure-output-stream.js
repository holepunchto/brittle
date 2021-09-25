import { test, configure } from '../../index.js'
import { Writable } from 'stream'
const output = new Writable({
  write (chunk, enc, cb) {
    process.stderr.write(chunk)
    cb()
  }
})
configure({ output })

test('configure: output', async function ({ pass }) {
  pass()
})