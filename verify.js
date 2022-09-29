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

function countWord(text, word) {
  let count = 0;
  let index = -1;
  while ((index = text.indexOf(word, index + 1)) !== -1) {
    count++;
  }
  return count;
}

function getFileInfo(file) {
  const content = fs.readFileSync(file, 'utf8');
  const hash = crypto.createHash('md5').update(content).digest('hex');

  return {
    content,
    hash,
    word: {
      see: countWord(content, ' see '),
      more: countWord(content, ' more '),
      into: countWord(content, ' into '),
    },
  };
}

let file1Info = getFileInfo('./document1.txt');
let fiel2Info = getFileInfo('./document2.txt');

// console.log(actualDocument1hash, actualDocument2hash);

if (
  hash.original.document1 !== file1Info.hash ||
  hash.original.document2 !== fiel2Info.hash
) {
  console.log('Files have been modified');
  process.exit(1);
}

const startAt = Date.now();

console.log('Go on and modify the files');

const interval = setInterval(() => {
  file1Info = getFileInfo('./document1.txt');
  fiel2Info = getFileInfo('./document2.txt');

  if (
    hash.modified.document1 === file1Info.hash &&
    hash.modified.document2 === fiel2Info.hash
  ) {
    clearInterval(interval);
    console.log(`Woohoo! You did it in ${Date.now() - startAt}ms!`);
    playNotification();
  } else if (
    file1Info.word.see + fiel2Info.word.see === 0 &&
    file1Info.word.more + fiel2Info.word.more === 20 &&
    file1Info.word.into + fiel2Info.word.into === 6
  ) {
    clearInterval(interval);
    console.log(
      `Woohoo! You did it in ${
        Date.now() - startAt
      }ms! But checksum is not matching.`
    );
    playNotification();
  }
}, 10);
