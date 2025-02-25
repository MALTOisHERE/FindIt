const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const open = promisify(fs.open);
const read = promisify(fs.read);
const close = promisify(fs.close);
const cors = require('cors'); // Add this line

const app = express();
const index = JSON.parse(fs.readFileSync('index.json'));
const FILE = 'users.txt';
const LIMIT = 100;

app.use(cors()); // Add this line

app.get('/api/count/:letter', (req, res) => {
  const letter = req.params.letter.toUpperCase();
  res.json({ count: index[letter]?.count || 0 });
});

app.get('/api/users', async (req, res) => {
  const letter = req.query.startsWith?.toUpperCase();
  const cursor = parseInt(req.query.cursor) || index[letter]?.startOffset || 0;
  const endOffset = index[letter]?.endOffset || 0;

  if (!letter || !index[letter]) return res.status(400).send('Invalid letter');

  const fd = await open(FILE, 'r');
  let position = cursor;
  const users = [];
  let buffer = Buffer.alloc(1024);

  while (users.length < LIMIT && position <= endOffset) {
    const { bytesRead } = await read(fd, buffer, 0, buffer.length, position);
    if (bytesRead === 0) break;

    const chunk = buffer.toString('utf8', 0, bytesRead);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line) continue;
      position += Buffer.byteLength(line) + 1;
      if (line[0].toUpperCase() !== letter) {
        if (users.length > 0) break; // Exit if moved to next letter
        else continue; // Skip lines not starting with the letter
      }
      users.push(line);
      if (users.length === LIMIT) break;
    }
  }

  await close(fd);
  res.json({ users, cursor: position > endOffset ? null : position });
});

app.listen(3001, () => console.log('Server running on port 3001'));