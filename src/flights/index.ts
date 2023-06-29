import webdriver, { Builder, By, Key, until } from 'selenium-webdriver';
import 'chromedriver';
import Chrome from 'selenium-webdriver/chrome';
import sleep from 'utils/sleep';
import soundAlarm from 'utils/soundAlarm';

const inputInitialInfo = async (driver: webdriver.WebDriver) => {
  let option = await driver.findElement(
    By.xpath(
      '/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div[1]/div[1]/div/div[1]/div[1]'
    )
  );

  await option.click();

  option = await driver.findElement(
    By.xpath(
      '/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div[1]/div[1]/div/div[1]/div[1]/div/div/div/div[2]/ul/li[2]'
    )
  );

  await option.click();
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
    .sendKeys(process.env.INITIAL_DATE || '05/08/2023', Key.TAB, Key.ENTER)
    .perform();
};

const searchForGoodFlights = async (
  driver: webdriver.WebDriver,
  date: number
) => {
  const lis = await driver.findElements(By.className('pIav2d'));

  for (const li of lis) {
    const duration = await (
      await li.findElement(By.xpath('.//div/div[2]/div/div[2]/div[3]/div'))
    ).getText();

    const price = await (
      await li.findElement(
        By.xpath('.//div/div[2]/div/div[2]/div[6]/div/div[2]/span')
      )
    ).getText();

    const leaveTime = await (
      await li.findElement(
        By.xpath(
          './/div/div[2]/div/div[2]/div[2]/div[1]/span/span[1]/span/span/span'
        )
      )
    ).getText();

    const arrivalTime = await (
      await li.findElement(
        By.xpath(
          './/div/div[2]/div/div[2]/div[2]/div[1]/span/span[2]/span/span/span'
        )
      )
    ).getText();

    const numberOfHours = Number(duration.split(' ')[0]);
    const formattedPrice = Number(price.split(' ')[1].replace('.', ''));
    const month = process.env.INITIAL_DATE?.split('/')[1];

    if (
      numberOfHours < Number(process.env.MAX_FLIGHT_TIME) &&
      formattedPrice < Number(process.env.MAX_PRICE)
    ) {
      console.log(
        `${date}/${month} ${leaveTime} - ${arrivalTime} | ${numberOfHours}h de voo | R$${formattedPrice}`
      );
      await soundAlarm();
    }
  }
};

const flights = async () => {
  const options = new Chrome.Options();
  options.windowSize({
    width: 1440,
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
  await driver.get('https://www.google.com/travel/flights?hl=pt-BR');

  await sleep(10000);

  try {
    await inputInitialInfo(driver);
    await sleep(10000);
    const rightArrow = await driver.findElement(
      By.xpath(
        '/html/body/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[1]/div/div[2]/div[2]/div/div/div[1]/div/div/div[1]/div/div[1]/div/div[3]/button'
      )
    );

    let date = Number(process.env.INITAL_DATE?.split('/')[0]);
    await searchForGoodFlights(driver, Number(date));

    for (let i = 1; i <= Number(process.env.DAYS_ON_WINDOW); i++) {
      await rightArrow.click();
      await sleep(10000);
      await searchForGoodFlights(driver, date + i);
    }
  } catch (error) {
    console.log(error);
  }
  await driver.quit();
};

export default flights;
