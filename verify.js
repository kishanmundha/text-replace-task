#!/usr/bin/env node

var fs = require('fs');
var crypto = require('crypto');
var playNotification = require('./play-notification');

const hash = {
  original: {
    document1: '9dc41de314ac77b5f4b93bb055df9d8c',
    document2: '346e5701dac6f763e9f1b3174d4ac486',
  },
  modified: {
    document1: 'ffa0f36f229923c869a6a9144ee10a72',
    document2: '65142974fc999d020ef4c2ce2a27f798',
  },
};

function getFileHash(file) {
  return crypto
    .createHash('md5')
    .update(fs.readFileSync(file, 'utf8'))
    .digest('hex');
}

let actualDocument1hash = getFileHash('./document1.txt');
let actualDocument2hash = getFileHash('./document2.txt');

console.log(actualDocument1hash, actualDocument2hash);

if (
  hash.original.document1 !== actualDocument1hash ||
  hash.original.document2 !== actualDocument2hash
) {
  console.log('Files have been modified');
  process.exit(1);
}

const startAt = Date.now();

console.log('Go on and modify the files');

const interval = setInterval(() => {
  actualDocument1hash = getFileHash('./document1.txt');
  actualDocument2hash = getFileHash('./document2.txt');

  if (
    hash.modified.document1 === actualDocument1hash &&
    hash.modified.document2 === actualDocument2hash
  ) {
    clearInterval(interval);
    console.log(`Woohoo! You did it in ${Date.now() - startAt}ms!`);
    playNotification();
  }
}, 10);
