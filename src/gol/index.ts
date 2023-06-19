import webdriver, { Builder, By, Key, until } from 'selenium-webdriver';

import 'chromedriver';
import Chrome from 'selenium-webdriver/chrome';
import sleep from 'utils/sleep';
import soundAlarm from 'utils/soundAlarm';

const gol = async () => {
  const options = new Chrome.Options();
  options.windowSize({
    width: 1550,
    height: 1300
  });
  // options.addArguments('--disable-extensions');
  // options.addArguments('--headless');
  // options.addArguments('--disable-gpu');
  // options.addArguments('--no-sandbox');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  await driver.get('https://www.voegol.com.br/');

  try {
    // escolhe só ida
    let option = await driver.findElement(
      By.xpath(
        '/html/body/div[1]/div/div/div/div/div/main/section/section/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[1]/div[1]/fieldset'
      )
    );

    await option.click();

    option = await driver.findElement(
      By.xpath(
        '/html/body/div[1]/div/div/div/div/div/main/section/section/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[1]/div[1]/fieldset/div/div/div/div[2]'
      )
    );

    await option.click();

    // escolhe salvador
    option = await driver.findElement(
      By.xpath(
        '/html/body/div[1]/div/div/div/div/div/main/section/section/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[1]/div[2]/div/div[2]/fieldset[1]/div[1]'
      )
    );

    await option.click();

    let input = await driver.findElement(
      By.xpath(
        '/html/body/div[1]/div/div/div/div/div/main/section/section/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[1]/div[2]/div/div[2]/fieldset[1]/div[1]/span[1]/span[1]/span[1]/input'
      )
    );

    await input.sendKeys('Salvador');

    option = await driver.findElement(
      By.xpath(
        '/html/body/div[1]/div/div/div/div/div/main/section/section/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[1]/div[2]/div/div[2]/fieldset[1]/div[1]/span[3]/span/span/ul/li[1]/ul/li'
      )
    );

    await option.click();

    // coloca data

    input = await driver.findElement(
      By.xpath(
        '/html/body/div[1]/div/div/div/div/div/main/section/section/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div[1]/div/div[1]/fieldset/div/input'
      )
    );

    await input.sendKeys('29072023');

    // clica em botao

    const button = await driver.findElement(
      By.xpath(
        '/html/body/div[1]/div/div/div/div/div/main/section/section/div/div/div[2]/div/div/div/div[1]/form/div[3]/div[3]/div[3]'
      )
    );

    await button.click();

    await sleep(15000);

    const time = await (
      await driver.findElement(
        By.xpath(
          '/html/body/app-root/b2c-flow/main/b2c-select-flight/div/section/form/div[5]/div/div[1]/b2c-bar-product/div[2]/p[1]/span[2]'
        )
      )
    ).getText();

    const price = await (
      await driver.findElement(
        By.xpath(
          '/html/body/app-root/b2c-flow/main/b2c-select-flight/div/section/form/div[5]/div/div[1]/b2c-bar-product/div[2]/p[5]/span[2]'
        )
      )
    ).getText();

    console.log(`Voo da Gol ${time} | Preço ${price}`);

    const isMyTime = time.includes('15:15');
    const priceFormatted = Number(price.split(' ')[1].replace(',', '.'));

    if (isMyTime && priceFormatted < 400) await soundAlarm();
  } catch (error) {
    console.log(error);
  }
  await driver.quit();
};

export default gol;
