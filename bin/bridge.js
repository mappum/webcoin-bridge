#!/usr/bin/env node

var Bridge = require('bitcoin-net').Bridge
var argv = require('minimist')(process.argv.slice(2))
var params = require(argv.network || 'webcoin-bitcoin')

var bridge = new Bridge(params)

bridge.on('connection', (peer) => {
  var uri = `${peer.socket.transport}://${peer.remoteAddress}`
  console.log(`Incoming connection: ${uri}`)
  peer.on('disconnect', () => {
    console.log(`Disconnected from peer: ${uri}`)
  })
  peer.on('error', (err) => {
    console.error(`Error (${uri}):`, err)
  })
})

bridge.on('bridge', function (webPeer, tcpPeer) {
  console.log(`Bridging WebRTC connection ` +
    `from ${webPeer.socket.transport}://${webPeer.remoteAddress} ` +
    `to tcp://${tcpPeer.remoteAddress}:${tcpPeer.remotePort}`)
})

bridge.accept({ port: argv.port }, (err) => {
  if (err) return console.error(err)
  if (bridge.acceptingWebsocket) {
    console.log(`Accepting websocket connections on port ${bridge.websocketPort}`)
  }
  if (bridge.acceptingWebRTC) {
    console.log(`Accepting webrtc connections`)
  }
})
