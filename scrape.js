const puppeteer = require("puppeteer");

const scrape = (url) => {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            executablePath: "C:/chrome-win/chrome.exe"
        });
        const page = await browser.newPage();
        await page.goto(url);

        const [el] = await page.$x('/html/body/div[4]/div/div[2]/div/div[1]/div[1]/section[1]/div/div[2]/div/div[7]/div/div/div[2]/strong');
        const value = await el.getProperty("textContent");
        const valueTxt = await value.jsonValue();

        await browser.close();
        resolve(valueTxt);
    });
}

module.exports = scrape;