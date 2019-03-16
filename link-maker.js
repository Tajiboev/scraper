const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url =
    "http://web.archive.org/web/20021018081739/http://www.fda.gov/po/enforceindex/oldenforce.html";
  await page.goto(url);

  const addresses = await page.evaluate(() =>
    Array.from(document.querySelectorAll("li a")).map(link => link.href)
  );

  var data = JSON.stringify(addresses);

  fs.writeFile("links.json", data, finished);
  function finished(err) {
    console.log("done!");
  }

  await browser.close();
})();
