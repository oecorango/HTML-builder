// 2 часа до дедлайна, вроде все работает, но полностью протестить
// не успеваю, голова уже квадратная с этим таском.
// Если что не работает, пишите, попробую поправить.

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// ----------------директории сборки---------------------
const dirBundleFolder = path.join(__dirname, 'project-dist');
const dirBundleCss = path.join(__dirname, 'project-dist', 'style.css');
const dirCopyAssets = path.join(__dirname, 'project-dist', 'assets');

// ----------------директории исходников-----------------
const dirFilesCss = path.join(__dirname, 'styles');
const dirAssets = path.join(__dirname, 'assets');

const eventEmitter = new EventEmitter();
const output = fs.createWriteStream(dirBundleCss);

// ----создаем папку сборки и вызываем функции сборки----
fs.mkdir(dirBundleFolder, { recursive: true }, err => {
  if (err) throw err;
  createCss();
  bundleCss();
  deleteAssetsFiles(dirCopyAssets);
  eventEmitter.on('start', () => {
    console.log('папка assets успешно очищена');
    copyAssetsFiles(dirAssets, dirCopyAssets);
  });
});

// ----------------собираем css файл---------------------
function createCss() {
  fs.open(dirBundleCss, 'w', (err) => {
    if(err) throw err;
  });
}

function bundleCss() {
  fs.readdir(dirFilesCss, (err, files) => {
    if (err) throw err;
    for (let i = 0; i < files.length; i++) {
      const filesDir = path.join(dirFilesCss, files[i]);
      if (path.extname(filesDir) === '.css') {
        const stream = fs.createReadStream(filesDir, 'utf-8');
        stream.on('data', chunk => output.write(chunk));
      }
    }
    console.log('файл со стилями успешно собран');
  });
}

// ----------------копируем assets-----------------------
function deleteAssetsFiles(dir) {
  fs.rm(dir, { recursive:true, force:true }, (err) => {
    if (err) throw err;
    eventEmitter.emit('start');
  });
}

function copyAssetsFiles(dir, copyDir) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    fs.mkdir(copyDir, { recursive: true }, err => {
      if (err) throw err;
      for (let i = 0; i < files.length; i++) {
        const fileDir = path.join(dir, files[i]);
        const copyFileDir = path.join(copyDir, files[i]);
        fs.stat(fileDir, function(err, stats) {
          if (stats.isFile()) { 
            fs.copyFile(fileDir, copyFileDir, err => {
              if(err) throw err;
            });
          } else {
            let folderCopyDir = path.join(copyDir, files[i]);
            copyAssetsFiles(fileDir , folderCopyDir);
          }
        });
      }
    });
  });
  console.log('папка assets успешно дополненна файлами/папками');
}

let data = '';
let compnonts = [];
const dirReadHtmlFile = path.join(__dirname, 'template.html');
const dirCreatHtmlFile = path.join(dirBundleFolder, 'index.html');
const dirComponentsHtml = path.join(__dirname, 'components');
const stream = fs.createReadStream(dirReadHtmlFile, 'utf-8');

stream.on('data', chunk => data += chunk);
stream.on('end', () => {
  fs.createWriteStream(dirCreatHtmlFile);
  fs.readdir(dirComponentsHtml, (err, files) => {
    if (err) throw err;
    files.forEach(elem => {
      compnonts.push(elem.split('.')[0]);
    });
    for (let i = 0; i < compnonts.length; i++) {
      let res = '';
      const filesDir = path.join(dirComponentsHtml, files[i]);
      const readComponents = fs.createReadStream(filesDir, 'utf-8');
      readComponents.on('data', chunk => res += chunk);
      readComponents.on('end', () => {
        if (data.includes(`{{${compnonts[i]}}}`)) {
          const a = data.replace(`{{${compnonts[i]}}}`, `\n${res}\n`);
          data = a;
          fs.writeFile(dirCreatHtmlFile, data, (err) => {
            if(err) throw err;
          });
        }
      });
    }
  });
  console.log('файл index.html скомпилирован');
});