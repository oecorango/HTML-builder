const fs = require('fs');
const path = require('path');

const dirBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const dirFiles = path.join(__dirname, 'styles');

const output = fs.createWriteStream(dirBundle);

fs.open(dirBundle, 'w', (err) => {
  if(err) throw err;
});

// необходимо сделать добавление пустой строки после записи i-го файла
fs.readdir(dirFiles, (err, files) => {
  if (err) throw err;
  for (let i = 0; i < files.length; i++) {
    const filesDir = path.join(dirFiles, files[i]);
    if (path.extname(filesDir) === '.css') {
      const stream = fs.createReadStream(filesDir, 'utf-8');
      stream.on('data', chunk => output.write(chunk));
    }
  }
  console.log('Файл со стилями успешно собран');
});

