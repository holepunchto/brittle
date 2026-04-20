const { Readable } = require('streamx')
const threadStreams = require('./thread-streams')

class ThreadHandler {
  isDone = false
  constructor({ thread, file, connection, onConfig }) {
    this.thread = thread
    this.file = file
    this.connection = connection
    this.onConfig = onConfig

    this.initialConfig = new Promise((resolve) => {
      this.setInitialConfig = resolve
    })
    this.result = new Promise((resolve) => {
      this.setResult = resolve
    })
    this.logs = new Readable()
    this.connection.on('data', (data) => {
      if (data.type === 'log') this.logs.push(data)
      if (data.type === 'result') this.setResult(data)
      if (data.type === 'config') {
        this.setInitialConfig(data)
        this.onConfig(data)
      }
    })

    this.done = new Promise((resolve) => {
      connection.on('end', () => resolve('done'))
      connection.on('error', () => resolve('error'))
    }).then(() => {
      this.isDone = true
    })

    this.result = new Promise((resolve) => {
      connection.on('data', (data) => {
        if (data.type === 'result') resolve(data)
      })
    })
  }

  start() {
    this.connection.write({ type: 'start' })
  }

  configure(config) {
    this.connection.write({ ...config, type: 'config' })
  }
}

class Threads {
  _currentIndex = 0
  threads = []
  running = false
  initialized = false
  done = undefined
  constructor(runner) {
    this.runner = runner
  }

  async init() {
    if (this.running) return this.running
    this.running = true
    setImmediate(async () => {
      this.printLogs()

      await this.sendInitialConfig()
      this.initialized = true

      this.start()
    })
  }

  start() {
    const worker = async () => {
      while (this._currentIndex < this.threads.length) {
        const thread = this.threads[this._currentIndex++]
        thread.start()
        await thread.done
      }
    }

    this.done = Promise.all(Array.from({ length: this.runner.jobs }, () => worker()))
  }

  async printLogs() {
    let testCount = 0
    let printIndex = 0
    let tapVersionPrinted = false
    while (printIndex < this.threads.length) {
      const current = this.threads[printIndex]
      current.logs.on('data', ({ args, subtype }) => {
        if (subtype === 'start') {
          if (!tapVersionPrinted) {
            this.runner.log('start')
            tapVersionPrinted = true
          }
          return
        }

        if (subtype === 'assert') {
          const [indent, oknotok, number, message] = args

          if (oknotok === 'not ok') global.Bare.exitCode = 1

          const derivedNumber = indent === '' ? ++testCount : number
          this.runner.log(subtype, indent, oknotok, derivedNumber, message)
          return
        }

        this.runner.log(subtype, ...args)
      })
      await current.done
      printIndex++
    }

    await this.printResults()
  }

  async printResults() {
    return new Promise((resolve) => {
      setImmediate(async () => {
        const results = await Promise.all(this.threads.map((t) => t.result))

        const tests = { pass: 0, count: 0 }
        const asserts = { pass: 0, count: 0 }
        let maxTime = 0
        for (const result of results) {
          tests.pass += result.tests.pass
          tests.count += result.tests.count
          asserts.pass += result.asserts.pass
          asserts.count += result.asserts.count
          if (result.time > maxTime) maxTime = result.time
        }

        this.runner.log('results', tests, asserts, maxTime)
        resolve()
      })
    })
  }

  async sendInitialConfig() {
    return new Promise((resolve) => {
      setImmediate(async () => {
        const configs = await Promise.all(this.threads.map((t) => t.initialConfig))
        await this.broadcastConfig({
          solo: configs.some((s) => s.solo),
          timeout: this.runner.defaultTimeout,
          bail: this.runner.bail,
          unstealth: this.runner.unstealth,
          source: this.runner.source
        })
        resolve()
      })
    })
  }

  async broadcastConfig(config) {
    for (const thread of this.threads) {
      if (thread.isDone) continue
      thread.configure(config)
    }
  }

  add(file) {
    const { stream: connection, handle } = threadStreams.createStream()
    const thread = new global.Bare.Thread(file, { data: { handle } })

    const onConfig = (data) => {
      if (data.skipAll !== undefined) this.runner.skipAll = data.skipAll
      if (this.initialized) this.broadcastConfig(data)
    }
    const threadHandler = new ThreadHandler({ thread, file, connection, onConfig })

    this.threads.push(threadHandler)
    this.init()
  }
}

module.exports = Threads
