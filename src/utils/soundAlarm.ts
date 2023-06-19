import player from 'play-sound';
import path from 'path';
import sleep from './sleep';

const caminhoAudio = path.join(__dirname, '..', 'alarm.wav');

const soundAlarm = async () => {
  const ipod = player();
  while (true) {
    const audio = ipod.play(caminhoAudio, (err) => {
      if (err) {
        console.log(`Erro ao reproduzir o som: ${err}`);
      }
    });
    await sleep(2500);

    audio.kill();
  }
};

export default soundAlarm;
