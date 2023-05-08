const fs = require('fs');
const path = require('path');

const dirFile = path.join(__dirname, 'message.txt');

fs.createWriteStream(dirFile);

const { stdin, stdout } = process;
stdout.write('Пажалуйста, введите Ваше сообщение!\n*** для выхода из программы наберите exit, либо нажмите CTRL + C\n');

function createText(data) {
  fs.appendFile(dirFile, data, (error) => {
    if (error) return console.error(error.message);
  });
}

stdin.on('data', data => {
  const dataSrting = data.toString();
  if (dataSrting.includes('exit')) {
    process.exit();
  } else {
    createText(dataSrting);
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('\nХорошего дня!');
});