import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import stylize from 'bare-stylize'
import process from 'process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const directory = await fs.promises.readdir(__dirname, { withFileTypes: true })
const files = directory.filter(dirent => !dirent.isDirectory())

for (const file of files) {
  if (file.name === 'all.mjs') continue
  const filepath = path.join(__dirname, file.name)

  console.log(stylize(['bold', 'green'], 'Running'), filepath)
  await import('file://' + filepath)
}

if (process.exitCode) {
  console.log(stylize(['bold', 'red'], 'Tests failed'))
} else {
  console.log(stylize(['bold', 'green'], 'Tests passed'))
}
