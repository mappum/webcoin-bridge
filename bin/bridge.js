#!/usr/bin/env node

var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))
var Bridge = require('../')
var params = require(argv.network || 'webcoin-bitcoin')
var https = require('https')
var http = require('http')
var onObj = require('on-object')

try {
  var wrtc = require('wrtc')
} catch (err) {
  wrtc = require('electron-webrtc')
}

var port = argv.port || 8192
var secure = argv.cert && argv.key
if (secure) {
  var server = https.createServer({
    cert: fs.readFileSync(argv.cert),
    key: fs.readFileSync(argv.key),
    ca: argv.ca ? fs.readFileSync(argv.ca) : null
  })
} else {
  server = http.createServer()
}

var bridge = Bridge(params.net, server, wrtc)

onObj(bridge).on({
  error (err) {
    console.error(err.stack)
  },

  connection (peer) {
    var uri = `${peer.transport}://${peer.remoteAddress}`
    console.log(`Incoming connection: ${uri}`)
    peer.on('disconnect', () => {
      console.log(`Disconnected from peer: ${uri}`)
    })
    peer.on('error', (err) => {
      console.error(`Error (${uri}):`, err)
    })
  },

  bridge (webPeer, tcpPeer) {
    console.log(`Bridging connection ` +
      `from ${webPeer.socket.transport}://${webPeer.remoteAddress} ` +
      `to tcp://${tcpPeer.remoteAddress}:${tcpPeer.remotePort}`)
  },

  connectError (err) {
    console.log('Connect error: ' + err.stack)
  }
})

server.listen(port, (err) => {
  if (err) return console.error(err)
  console.log(`Accepting ${secure ? 'secure ' : ''}` +
    `websocket connections on port ${port}`)
  console.log(`Accepting webrtc connections`)
})
