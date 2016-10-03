'use strict'

const EventEmitter = require('events')
const dns = require('dns')
const net = require('net')
const Swarm = require('peer-exchange')
const ws = require('websocket-stream')
const old = require('old')
const once = require('once')
const { random, floor } = Math

function getDNSPeers (seeds, cb) {
  var seed = seeds[floor(random() * seeds.length)]
  dns.resolve(seed, cb)
}

class Bridge extends EventEmitter {
  constructor (params, server, wrtc) {
    super()

    // TODO: accept an array of params for multiple networks
    this.params = params

    // TODO: use a swarm implementation that supports multiple networks
    var getPeers = this.getPeers.bind(this)
    this.exchange = Swarm(params.magic.toString(16), { getPeers, wrtc })
    this.exchange.on('error', (err) => this.emit('error', err))

    this.server = ws.createServer({ server }, (socket) => {
      socket.on('error', (err) => this.emit('error', err))
      this.exchange.accept(socket)
    })
  }

  getPeers (cb) {
    var seeds = this.params.dnsSeeds
    getDNSPeers(seeds, (err, addresses) => {
      if (err) return cb(err)
      var candidates = addresses.map((a) => this.connectFunc(a))
      cb(null, candidates)
    })
  }

  connectFunc (address) {
    return (cb) => {
      cb = once(cb)
      var socket = net.connect(this.params.defaultPort, address, () => {
        cb(null, socket)
      })
      socket.on('error', (err) => {
        console.log(err)
      })
    }
  }
}

module.exports = old(Bridge)
