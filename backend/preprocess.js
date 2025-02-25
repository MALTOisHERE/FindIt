const fs = require('fs');
const readline = require('readline');

async function preprocess(inputFile, indexFile) {
  const index = {};
  let currentLetter = null;
  let startOffset = 0;
  let count = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(inputFile),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const firstChar = line[0].toUpperCase();
    if (firstChar !== currentLetter) {
      if (currentLetter !== null) {
        index[currentLetter].endOffset = startOffset - 1;
      }
      currentLetter = firstChar;
      if (!index[currentLetter]) {
        index[currentLetter] = { startOffset, count: 0 };
      }
    }
    index[currentLetter].count++;
    startOffset += Buffer.byteLength(line) + 1; // +1 for newline
  }

  if (currentLetter !== null) {
    index[currentLetter].endOffset = startOffset - 1;
  }

  fs.writeFileSync(indexFile, JSON.stringify(index));
}

preprocess('users.txt', 'index.json');