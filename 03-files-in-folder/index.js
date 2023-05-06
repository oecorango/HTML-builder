const fs = require('fs');
const path = require('path');

const dirFiles = path.join(__dirname, 'secret-folder');

async function myReedDir (dir) {
  fs.readdir(dir, {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      if (file.isFile()) {
        const name = file.name.split('.')[0];
        const dirFiles = path.join(__dirname, 'secret-folder', file.name);

        fs.stat(dirFiles, function() {
          return function(err, stats) {
            console.log(`${name} -- ${path.extname(dirFiles).replace('.', '')} -- ${stats.size}b`);
          };
        }(dirFiles));

      }
    });
  });
}

myReedDir(dirFiles);