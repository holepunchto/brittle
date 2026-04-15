const { Duplex } = require('streamx')
const FramedStream = require('framed-stream')

module.exports = {
  createStream() {
    const Pipe = require('bare-pipe')
    const [cReceiver, sSender] = Pipe.pipe()
    const [sReceiver, cSender] = Pipe.pipe()

    const recv = new Pipe(sReceiver)
    const send = new Pipe(sSender)

    const duplex = new (class PipeDuplex extends Duplex {
      constructor({ send, recv, ...opts }) {
        super(opts)
        this.recv = recv
        this.send = send
        this._write = (data, cb) => this.send.write(data, cb)
        this._final = (cb) => this.send.end(cb)
        this.recv.on('data', (chunk) => this.push(chunk))
        this.recv.on('end', () => this.push(null))
      }
    })({ send, recv })

    return { stream: new FramedStream(duplex), cReceiver, cSender }
  },
  createStreamFromFds(receiver, sender) {
    const Pipe = require('bare-pipe')
    const recv = new Pipe(receiver)
    const send = new Pipe(sender)
    recv.unref()

    const duplex = new (class PipeDuplex extends Duplex {
      constructor({ send, recv, ...opts }) {
        super(opts)
        this.recv = recv
        this.send = send
        this._write = (data, cb) => this.send.write(data, cb)
        this._final = (cb) => this.send.end(cb)
        this.recv.on('data', (chunk) => this.push(chunk))
        this.recv.on('end', () => this.push(null))
      }
    })({ send, recv })

    return new FramedStream(duplex)
  }
}
