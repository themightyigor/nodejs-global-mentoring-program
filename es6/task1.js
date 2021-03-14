import { stdin, stdout } from 'process';

stdin.on('data', (data) => {
  const reversedData = data.reverse();
  stdout.write(`${reversedData}\n`);
});
