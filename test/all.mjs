import fs from 'fs'
import { fileURLToPath } from 'url'
import process from 'process'
import os from 'os'
import { spawn } from 'child_process'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isJs = (filename) =>
  filename.endsWith('.js') || filename.endsWith('.mjs') || filename.endsWith('.cjs')
const files = (await fs.promises.readdir(__dirname, { withFileTypes: true }))
  .filter((dirent) => !dirent.isDirectory() && dirent.name !== 'all.mjs' && isJs(dirent.name))
  .map((dirent) => path.join(__dirname, dirent.name))

const parallelism = process.argv.includes('--no-parallel') ? 1 : os.availableParallelism()
let failed = false
const failedTests = []
let currentIndex = 0

async function worker() {
  while (currentIndex < files.length) {
    const current = files[currentIndex++]
    console.log('Running', current)

    const { code, signal } = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [current], { stdio: 'inherit' })

      child.on('error', reject)
      child.on('exit', (code, signal) => {
        resolve({ code, signal })
      })
    })

    if (code !== 0 || signal) {
      failed = true
      failedTests.push({ file: current, code, signal })
    }
  }
}

const workerCount = Math.min(parallelism, files.length)
await Promise.all(Array.from({ length: workerCount }, () => worker()))

if (failed) {
  process.exitCode = 1
  console.log('\nTests failed:')
  failedTests.forEach(({ file, code, signal }) =>
    console.log('  -', file, `(exit code: ${code}${signal ? `, signal: ${signal}` : ''})`)
  )
} else {
  console.log('Tests passed')
}
