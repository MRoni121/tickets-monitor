import flights from 'flights';
import gol from 'gol';
import 'reflect-metadata';
import sleep from 'utils/sleep';

const loop = async () => {
  while (true) {
    await flights();
    await sleep(30 * 60 * 1000);
    // await gol();
    // await sleep(15 * 60 * 1000);
  }
};

loop();
