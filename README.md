# webcoin-bridge

[![npm version](https://img.shields.io/npm/v/webcoin-bridge.svg)](https://www.npmjs.com/package/webcoin-bridge)
[![Build Status](https://travis-ci.org/mappum/webcoin-bridge.svg?branch=master)](https://travis-ci.org/mappum/webcoin-bridge)
[![Dependency Status](https://david-dm.org/mappum/webcoin-bridge.svg)](https://david-dm.org/mappum/webcoin-bridge)

**Bridge connections from the Websocket/WebRTC network to the TCP network**

Use `webcoin-bridge` to run a node that accepts connections from Webcoin browser peers (via Websocket and WebRTC) and proxies them to a random TCP Bitcoin peer, in order to help bridge the networks.

## Usage

```sh
$ npm install -g webcoin-bridge
$ webcoin-bridge
```
