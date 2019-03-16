const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url =
    "http://web.archive.org/web/20021018081739/http://www.fda.gov/bbs/topics/ENFORCE/ENF00357.html";
  await page.goto(url);

  const text = await page.evaluate(
    () => document.querySelector("pre").innerText
  );

  fs.writeFile("text.txt", text, finished);
  function finished(err) {
    console.log("done!");
  }

  await browser.close();
})();
