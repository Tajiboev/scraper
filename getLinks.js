const puppeteer = require("puppeteer");
const fs = require("fs");

// const urls = get data from file 


async function getLinks(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url.href);

  const linksInThePage = await page.evaluate(() =>
    Array.from(document.querySelectorAll("li a")).map(link => ({
      "text": link.text.replace(' \n  ', ' ').trim(),
      "href": link.href
    }))
  );

  var data = JSON.stringify(linksInThePage);

  fs.writeFile(`links/${url.urlTitle}-link.json`, data, finished);

  function finished(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
  };
  browser.close();
};

for (const eachPage of urls) {
  getLinks(eachPage)
};