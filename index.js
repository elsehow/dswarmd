#!/usr/bin/env node
function usage () {
  return 'USAGE: dswarmd -k keys.json -n "my-device-name"\n\nGenerate a keys.json file with ssb-keys generate().'
}
var argv = require('minimist')(process.argv.slice(2))
if (!argv.k) {
  console.log(usage())
  process.exit(1)
}
var keys = JSON.parse(require('fs').readFileSync(argv.k))
if (!keys || !keys.public || !keys.private) {
  console.log(usage())
  process.exit(1)
}
var deviceName = argv.n
if (!deviceName || !deviceName.length) {
  console.log(usage())
  process.exit(1)
}
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
var myipS = require('my-ip-kefir')
var Kefir = require('kefir')
function putS (ip) {
  return Kefir.fromNodeCallback(cb => {
    kv.put(deviceName, ip, cb)
  })
}
myipS(1000, 'http://ipecho.net/plain')
  .filter(x=>!!x) // truthy values only
  .skipDuplicates()
  .flatMap(ip => {
    return putS(ip)
  })
  .map(n => n.value.v)
  .onValue(ip => {
    console.log(`[${deviceName}] ${ip}`)
  })
