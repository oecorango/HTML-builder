const fs = require('fs');
const path = require('path');

const dirCopy = path.join(__dirname, 'files');
const dirPaste = path.join(__dirname, 'copy-files');

function copyFiles() {
  fs.readdir(dirCopy, (err, files) => {
    if (err) throw err;
    for (let i = 0; i < files.length; i++) {
      const fileDir = path.join(dirCopy, files[i]);
      const copyDir = path.join(dirPaste, files[i]);
      fs.stat(fileDir, function(err, stats) {
        if (stats.isFile()) {
          //копирывание файлов
          fs.copyFile(fileDir, copyDir, err => {
            if(err) throw err;
          });

        } else {
          //создание папок, если они есть
          // let folderDir = path.join(dirPaste, files[i]);
          // fs.mkdir(folderDir, err => {
          //   if (err) throw err;
          // });
          // добавить рекрусию для копирывания файлов в папках
          // copyFiles() 
        }
      });
    }
    console.log('Файлы успешно скопированы');
  });
}

function deleteFiles() {
  fs.readdir(dirPaste, (err, files) => {
    if (err) throw err;
    for (let i = 0; i < files.length; i++) {
      const deleteFile = path.join(dirPaste, files[i]);

      fs.stat(deleteFile, function(err, stats) {
        if (stats.isFile()) {
          // удаление файлов
          fs.unlink(deleteFile, (err) => {
            if (err) throw err;
          });

        } else {
          // удаление папок
          fs.rm(deleteFile, { recursive:true }, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
}

fs.mkdir(dirPaste, { recursive: true }, err => {
  if (err) throw err;
  deleteFiles();
  copyFiles();
});


