const puppeteer = require("puppeteer");
const fs = require("fs");

async function getLinks(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url.href);

  const linksInThePage = await page.evaluate(() =>
    Array.from(document.querySelectorAll("p a"))
    .map(link => ({
      "text": link.text.replace(' \n  ', ' ').trim(),
      "href": link.href
    })).filter(elem => elem.text.includes("ENFORCEMENT REPORT FOR"))
  );

  var data = JSON.stringify(linksInThePage);

  if (linksInThePage.length > 1) {
    fs.writeFile(`links/${url.urlTitle}-link.json`, data, finished);
  }

  function finished(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
  };
  browser.close();
};


const urls = [{
    "urlTitle": "2002",
    "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/2002enforce.html"
  },
  {
    "urlTitle": "2001",
    "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/2001enforce.html"
  }
];

for (const eachPage of urls) {
  getLinks(eachPage)
};