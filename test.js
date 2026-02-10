const { Builder, By, Key, until } = require("selenium-webdriver");

async function maybeAcceptGoogleConsent(driver) {

  const candidates = [

    By.id("L2AGLb"),
    By.css('button[aria-label="Accept all"]'),
    By.css('button[aria-label="Acceptă tot"]'),
    By.css('button[aria-label="Accept all cookies"]'),
    By.xpath('//button//*[contains(text(),"Accept")]/ancestor::button'),
    By.xpath('//button//*[contains(text(),"Acceptă")]/ancestor::button'),
    By.xpath('//button//*[contains(text(),"Sunt de acord")]/ancestor::button'),
    By.xpath('//button[contains(., "Accept") or contains(., "Acceptă") or contains(., "Sunt de acord")]'),
  ];

  for (const locator of candidates) {
    try {
      const el = await driver.wait(until.elementLocated(locator), 1500);
      await driver.wait(until.elementIsVisible(el), 1500);
      await driver.wait(until.elementIsEnabled(el), 1500);
      await el.click();
      return true;
    } catch (_) {
    }
  }
  return false;
}

(async function firstTest() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("https://www.google.com");
    await maybeAcceptGoogleConsent(driver);

    const searchBoxLocator = By.name("q");
    const searchBox = await driver.wait(until.elementLocated(searchBoxLocator), 10000);
    await driver.wait(until.elementIsVisible(searchBox), 10000);
    await driver.wait(until.elementIsEnabled(searchBox), 10000);
    await searchBox.click();
    await searchBox.clear();
    await searchBox.sendKeys("Selenium JavaScript", Key.RETURN);

    await driver.wait(until.titleContains("Selenium"), 10000);
  } finally {
   //await driver.quit();
  }
})();
