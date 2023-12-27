const puppeteer = require("puppeteer");

const scrape = (browserPath, url, xPath) => {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            // chrome or chromium executable
            executablePath: `${browserPath}`
        });
        const page = await browser.newPage();
        await page.goto(url);

        const [el] = await page.$x(`${xPath}`);
        const value = await el.getProperty("textContent");
        const valueTxt = await value.jsonValue();

        await browser.close();
        resolve(valueTxt);
    });
}

module.exports = scrape;