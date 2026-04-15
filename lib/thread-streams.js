const { Duplex } = require('streamx')
const FramedStream = require('framed-stream')

class PipeDuplex extends Duplex {
  constructor({ send, recv }) {
    super()
    this.recv = recv
    this.send = send
    this._write = (data, cb) => this.send.write(data, cb)
    this._final = (cb) => this.send.end(cb)
    this.recv.on('data', (chunk) => this.push(chunk))
    this.recv.on('end', () => this.push(null))
  }
}

class JsonStream extends Duplex {
  constructor(stream) {
    super()
    this.rawStream = stream
    this.framedStream = new FramedStream(stream)
    this.framedStream.on('data', (rawData) => {
      this.push(JSON.parse(rawData.toString()))
    })
    this.framedStream.on('end', () => this.push(null))
  }

  write(data) {
    this.framedStream.write(JSON.stringify(data))
  }
}

module.exports = {
  createStream() {
    const Pipe = require('bare-pipe')
    const [cReceiver, sSender] = Pipe.pipe()
    const [sReceiver, cSender] = Pipe.pipe()

    const recv = new Pipe(sReceiver)
    const send = new Pipe(sSender)

    const duplex = new PipeDuplex({ send, recv })

    return { stream: new JsonStream(duplex), cReceiver, cSender }
  },
  createStreamFromFds(receiver, sender) {
    const Pipe = require('bare-pipe')
    const recv = new Pipe(receiver)
    const send = new Pipe(sender)
    recv.unref()

    const duplex = new PipeDuplex({ send, recv })

    return new JsonStream(duplex)
  }
}
