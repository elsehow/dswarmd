#!/usr/bin/env node
function usage () {
  return 'USAGE: dswarmd -k keys.json -n "my-device-name"\n\nGenerate a keys.json file with ssb-keys generate().\n\nOptional arguments:\n\n-u  URL to check for global IP address.\n\n-i   Set interval to check url (ms).'
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
var opts = {
  keys: keys,
  sodium: require('chloride/browser'),
  valueEncoding: 'json',
  hubs: [ 'https://signalhub.mafintosh.com' ]
}

require('./lib')(opts,argv.n,argv.i,argv.u)
  .onValue(ip => {
    console.log(`[${deviceName}] ${ip}`)
  })

var spawn = require('electron-spawn')
var electron = spawn('lib.js', opts, deviceName, argv.i, argv.u, {
  detached: true
})
electron.stderr.on('data', function (data) {
  console.error(data.toString())
})
electron.stdout.on('data', function (data) {
  console.log(data.toString())
})
