import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import colors from 'ansi-colors'
import process from 'process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const directory = await fs.readdir(__dirname, { withFileTypes: true })
const files = directory.filter(dirent => !dirent.isDirectory())

for (const file of files) {
  if (file.name === 'all.mjs') continue
  const filepath = path.join(__dirname, file.name)

  console.log(colors.green.bold('Running'), filepath)
  await import('file://' + filepath)
}

if (process.exitCode) {
  console.log(colors.red.bold('Tests failed'))
} else {
  console.log(colors.green.bold('Tests passed'))
}
