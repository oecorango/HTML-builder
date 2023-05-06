const fs = require('fs');
const path = require('path');

let data = '';
const dirFile = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(dirFile, 'utf-8');

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));