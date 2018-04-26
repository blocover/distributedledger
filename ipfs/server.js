'use strict'

const series = require('async/series')
const IPFS = require('ipfs')
var fs = require('fs');

const node = new IPFS()
let fileMultihash

var filename = 'meta-ukulele.mp3.txt'; // testfile

series([
  (cb) => node.on('ready', cb),
  (cb) => node.version((err, version) => {
    if (err) { return cb(err) }
    console.log('Version:', version.version)
    cb()
  }),

  (cb) => node.files.add(
      
    {
    path: filename,
    content: fs.readFileSync(filename)
  }, (err, filesAdded) => {
    if (err) { return cb(err) }

    console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
    fileMultihash = filesAdded[0].hash
    cb()
  }),

  (cb) => node.files.cat(fileMultihash, (err, data) => {
    if (err) { return cb(err) }

    console.log('\nFile content:')
    process.stdout.write(data)
  })
])