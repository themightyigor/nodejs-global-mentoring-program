const csvtojson = require('csvtojson');
const fs = require('fs');

const csvPath = './csv/data.csv';
const txtPath = './csv/data.txt';

const readStream = fs.createReadStream(csvPath);
const writeStream = fs.createWriteStream(txtPath, 'utf8');

csvtojson()
  .fromStream(readStream)
  .subscribe(
    (json) => {
      const nextString = JSON.stringify(json);
      writeStream.write(`${nextString}\n`);
    },
    (error) => {
      console.error(`Something went wrong: ${error.message}`);
    }
  );
