'use strict'
const Globbie = require('globbie')
function glob(args = []) {
  const files = []
  for (const g of args) {
    const glob = new Globbie(g, { sync: true })
    const matches = glob.match()

    if (matches.length === 0) {
      if (g[0] === '-') continue
      console.error(`Error: no files found when resolving ${g}`)
      process.exit(1)
    }

    files.push(...matches)
  }
  return files
}
module.exports = glob
