import webdriver, {
  Builder,
  By,
  Key,
  until,
  WebDriver
} from 'selenium-webdriver';
import 'chromedriver';
import Chrome, { ServiceBuilder } from 'selenium-webdriver/chrome';
import sleep from 'utils/sleep';
import soundAlarm from 'utils/soundAlarm';

const inputInitialInfo = async (driver: webdriver.WebDriver) => {
  let option = await driver.findElement(
    By.xpath(
      '/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div[1]/div[1]/div/div[1]/div[1]'
    )
  );

  await option.click();

  // option = await driver.findElement(
  //   By.xpath(
  //     '/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div/div/div/div[2]/ul/li[2]'
  //   )
  // );

  // await option.click();

  await sleep(1000);
  // escolhe destino
  await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.TAB).perform();

  await sleep(1000);
  await driver
    .actions()
    .sendKeys(process.env.FROM || 'ssa')
    .perform();

  await sleep(1000);
  await driver.actions().sendKeys(Key.ARROW_DOWN, Key.ENTER).perform();

  await sleep(1000);
  await driver.actions().sendKeys(Key.TAB).perform();

  await sleep(1000);
  await driver
    .actions()
    .sendKeys(process.env.TO || 'sao paulo')
    .perform();

  await sleep(1000);
  await driver.actions().sendKeys(Key.ARROW_DOWN, Key.ENTER, Key.TAB).perform();

  await sleep(1000);
  await driver
    .actions()
    .sendKeys(process.env.INITIAL_DATE || '05/08/2023')
    .perform();

  await sleep(1000);
  await driver
    .actions()
    .sendKeys(Key.TAB, process.env.FINISH_DATE || '')
    .perform();

  await sleep(1000);
  await driver.actions().sendKeys(Key.TAB, Key.TAB, Key.ENTER).perform();
};

const searchForGoodFlights = async (
  driver: webdriver.WebDriver,
  initial_date: number
) => {
  const lis = await driver.findElements(By.className('pIav2d'));

  for (const li of lis) {
    const duration = await (
      await li.findElement(By.xpath('.//div/div[2]/div/div[2]/div/div[3]/div'))
    ).getText();

    const price = await (
      await li.findElement(
        By.xpath('.//div/div[2]/div/div[2]/div/div[6]/div[1]/div[2]/span')
      )
    ).getText();

    const leaveTime = await (
      await li.findElement(
        By.xpath(
          './/div/div[2]/div/div[2]/div/div[2]/div[1]/span/span[1]/span/span/span'
        )
      )
    ).getText();

    const arrivalTime = await (
      await li.findElement(
        By.xpath(
          './/div/div[2]/div/div[2]/div/div[2]/div[1]/span/span[2]/span/span/span'
        )
      )
    ).getText();

    const numberOfHours = Number(duration.split(' ')[0]);
    const formattedPrice =
      Number(price.split(' ')[1]?.replace?.('.', '')) || 99999;
    const month = process.env.INITIAL_DATE?.split('/')[1];

    if (
      numberOfHours < Number(process.env.MAX_FLIGHT_TIME || 999) &&
      formattedPrice < Number(process.env.MAX_PRICE)
    ) {
      console.log(
        `${initial_date}/${month} ${leaveTime} - ${arrivalTime} | ${numberOfHours}h de voo | R$${formattedPrice}`
      );
      await soundAlarm();
    }
  }
};

const flights = async () => {
  // options.addArguments('--disable-extensions');
  // options.addArguments('--disable-gpu');

  const options = new Chrome.Options();
  options.windowSize({
    width: 1440,
    height: 1300
  });

  // options.addArguments('--no-sandbox');
  // options.addArguments('--disable-dev-shm-usage');
  // options.addArguments('--headless');

  const service = new ServiceBuilder();

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.get('https://www.google.com/travel/flights?hl=pt-BR');

  await sleep(5000);

  try {
    await inputInitialInfo(driver);
    await sleep(10000);
    const rightArrowInitialDate = await driver.findElement(
      By.xpath(
        // '/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div/div[2]/div[2]/div/div/div[1]/div/div/div[1]/div/div[1]/div/div[3]/button'
        '/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div/div[2]/div[2]/div/div/div[1]/div/div/div[1]/div/div[1]/div/div[3]/button'
      )
    );
    const rightArrowFinishDate = await driver.findElement(
      By.xpath(
        '/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div/div[2]/div[2]/div/div/div[1]/div/div/div[1]/div/div[2]/div/div[2]/button'
      )
    );

    let date = Number(process.env.INITIAL_DATE?.split('/')[0]);
    await searchForGoodFlights(driver, Number(date));

    for (let i = 1; i <= Number(process.env.DAYS_ON_WINDOW); i++) {
      await rightArrowFinishDate.click();
      await sleep(5000);
      await searchForGoodFlights(driver, date + i);
    }
  } catch (error) {
    console.log(error);
  }
  await driver.quit();
};

export default flights;
