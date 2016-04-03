#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2))
var keys = JSON.parse(require('fs').readFileSync(argv.k))
var deviceName = argv.n
var wrtc = require('electron-webrtc')()
var swarmlog = require('swarmlog')
var sub = require('subleveldown')
var level = require('level')
var db = level('/tmp/kv.db')
var log = swarmlog({
  keys: keys,
  sodium: require('chloride/browser'),
  db: sub(db, 'log'),
  wrtc: wrtc,
  valueEncoding: 'json',
  hubs: [ 'https://signalhub.mafintosh.com' ]
})
var hyperkv = require('hyperkv')
var kv = hyperkv({
  log: log,
  db: sub(db, 'kv')
})
var ipkv = require('my-ip-kv')
ipkv(kv, deviceName)
  .map(n => n.value.v)
  .log(deviceName)
