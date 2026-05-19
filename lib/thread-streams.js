const { Duplex } = require('streamx')
const Channel = require('bare-channel')

class ChannelStream extends Duplex {
  constructor(channel, opts = undefined) {
    super(opts)

    this.connection = channel.connect()
  }

  async _write(data, cb) {
    let err = null
    try {
      await this.connection.write(data)
    } catch (e) {
      err = e
    }
    cb(err)
  }

  async _read(cb) {
    let err = null
    try {
      this.push(await this.connection.read())
    } catch (e) {
      err = e
    }
    cb(err)
  }
}

module.exports = {
  createStream() {
    const channel = new Channel()

    return { stream: new ChannelStream(channel), handle: channel.handle }
  },
  createStreamFrom(handle) {
    const channel = Channel.from(handle)

    return new ChannelStream(channel)
  }
}
