const { Session } = require('inspector')
const process = require('process')
const fs = require('fs')
const path = require('path')

module.exports = async function recordCoverage (dir) {
  const session = new Session()
  session.connect()

  const sessionPost = (...args) => new Promise((resolve, reject) =>
    session.post(...args, (err, result) => err ? reject(err) : resolve(result))
  )

  await sessionPost('Profiler.enable')
  await sessionPost('Profiler.startPreciseCoverage', { callCount: true, detailed: true })

  process.once('beforeExit', async () => {
    const v8Report = await sessionPost('Profiler.takePreciseCoverage')
    global.Bare ? session.destroy() : session.disconnect()

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'v8-coverage.json'), JSON.stringify(v8Report))
  })
}
