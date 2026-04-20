const { Duplex } = require('streamx')

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
    const Channel = require('bare-channel')
    const channel = new Channel()

    return { stream: new ChannelStream(channel), handle: channel.handle }
  },
  createStreamFrom(handle) {
    const Channel = require('bare-channel')
    const channel = Channel.from(handle)

    return new ChannelStream(channel)
  }
}
