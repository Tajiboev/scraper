const puppeteer = require("puppeteer");
const fs = require("fs");

fs.readFile('links/1995 Enforcement Reports-link.json', (err, data) => {
    if (err) throw err;
    var links = JSON.parse(data);
    for (const eachPage of links) {
        scrape(eachPage)
    };
});

async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url.href);

    const text = await page.evaluate(() => document.querySelector('pre').innerText.trim());

    let rgx = url.text.match(/\d{2,4}/g);
    let fileName = `text/Report-${rgx[2]}-${rgx[0]}-${rgx[1]}`;

    fs.writeFile(fileName, text, finish);

    function finish(e) {
        if (e) {
            console.log(`error occured in ${url}`, e);
        } else {
            console.log("success");
        };
    };
    browser.close();
};