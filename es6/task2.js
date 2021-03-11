import csvtojson from 'csvtojson';
import { createReadStream, createWriteStream } from 'fs';

const csvPath = './csv/data.csv';
const txtPath = './csv/data.txt';

const readStream = createReadStream(csvPath);
const writeStream = createWriteStream(txtPath, 'utf8');

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
