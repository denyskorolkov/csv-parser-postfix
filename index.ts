import * as fs from 'fs';
import parser from './src/parser';

fs.readFile(process.argv[2], (err, data) => {
  if (err) {
    throw err;
  }
  console.log(parser(data.toString()));
});
