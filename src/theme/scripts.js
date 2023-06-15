const testFolder = '../assets/icons';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(`${file.split('.')[0]},`);
  });
});
