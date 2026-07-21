const { Readable } = require('streamx')
const threadStreams = require('./thread-streams')

class ThreadHandler {
  isDone = false
  constructor({ thread, file, connection, onStateUpdate }) {
    this.thread = thread
    this.file = file
    this.connection = connection
    this.onStateUpdate = onStateUpdate

    const { promise: initialState, resolve: setInitialState } = Promise.withResolvers()
    this.initialState = initialState

    const { promise: result, resolve: setResult } = Promise.withResolvers()
    this.result = result

    this.logs = new Readable()
    this.connection.on('data', (data) => {
      if (data.type === 'log') this.logs.push(data)
      else if (data.type === 'result') setResult(data)
      else if (data.type === 'state') {
        setInitialState(data)
        this.onStateUpdate(data)
      }
    })

    const { promise: done, resolve: setDone, reject: setError } = Promise.withResolvers()
    this.done = done
    connection.on('end', () => setDone())
    connection.on('error', (error) => setError(error))

    done.finally(() => {
      this.isDone = true
    })
  }

  start() {
    this.connection.write({ type: 'start' })
  }

  setState(state) {
    this.connection.write({ ...state, type: 'state' })
  }
}

class Threads {
  _currentIndex = 0
  threads = []
  running = false
  initialized = false

  constructor(runner) {
    this.runner = runner
  }

  async run() {
    if (this.running) return
    this.running = true

    await this.runner._wait()
    const tapOutput = this.tapOutput()

    await this.sendInitialState()
    this.initialized = true

    await Promise.all(this.startWorkers())
    await tapOutput

    for (const thread of this.threads) thread.thread.join()
  }

  startWorkers() {
    const worker = async () => {
      while (this._currentIndex < this.threads.length) {
        const thread = this.threads[this._currentIndex++]
        thread.start()
        await thread.done
      }
    }

    return Array.from({ length: Math.min(this.runner.jobs, this.threads.length) }, () => worker())
  }

  async tapOutput() {
    let testCount = 0
    let currentIndex = 0
    let tapVersionPrinted = false
    while (currentIndex < this.threads.length) {
      const current = this.threads[currentIndex]
      current.logs.on('data', ({ args, subtype }) => {
        if (subtype === 'start') {
          if (!tapVersionPrinted) {
            this.runner.log('start')
            tapVersionPrinted = true
          }
        } else if (subtype === 'assert') {
          const [indent, oknotok, number, message] = args

          if (oknotok === 'not ok') global.Bare.exitCode = 1

          const derivedNumber = indent === '' ? ++testCount : number
          this.runner.log(subtype, indent, oknotok, derivedNumber, message)
        } else {
          this.runner.log(subtype, ...args)
        }
      })

      await current.done
      currentIndex++
    }

    await this.outputResults()
  }

  async outputResults() {
    const results = await Promise.all(this.threads.map((t) => t.result))

    const tests = { pass: 0, count: 0 }
    const asserts = { pass: 0, count: 0 }
    for (const result of results) {
      tests.pass += result.tests.pass
      tests.count += result.tests.count
      asserts.pass += result.asserts.pass
      asserts.count += result.asserts.count
    }

    this.runner.log('results', tests, asserts)
  }

  async sendInitialState() {
    const states = await Promise.all(this.threads.map((t) => t.initialState))
    await this.broadcastState({
      solo: states.some((s) => s.solo),
      timeout: this.runner.defaultTimeout,
      bail: this.runner.bail,
      unstealth: this.runner.unstealth,
      source: this.runner.source
    })
  }

  async broadcastState(state) {
    for (const thread of this.threads) {
      if (thread.isDone) continue
      thread.setState(state)
    }
  }

  add(file) {
    const { stream: connection, handle } = threadStreams.createStream()
    const thread = new global.Bare.Thread(file, {
      data: { handle, isBrittleThread: true, names: this.runner.names }
    })

    const onStateUpdate = (state) => {
      if (state.skipAll !== undefined) this.runner.skipAll = state.skipAll
      if (this.initialized) this.broadcastState(state)
    }
    const threadHandler = new ThreadHandler({ thread, file, connection, onStateUpdate })

    this.threads.push(threadHandler)
    this.run()
  }
}

module.exports = Threads
