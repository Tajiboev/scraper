const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const urls = [{
      "urlTitle": "2002 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/2002enforce.html"
    },
    {
      "urlTitle": "2001 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/2001enforce.html"
    },
    {
      "urlTitle": "2000 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/2000enforce.html"
    },
    {
      "urlTitle": "1999 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/99enforce.html"
    },
    {
      "urlTitle": "1998 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/98enforce.html"
    },
    {
      "urlTitle": "1997 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/97enforce.html"
    },
    {
      "urlTitle": "1996 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/96enforce.html"
    },
    {
      "urlTitle": "1995 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/95enforce.html"
    },
    {
      "urlTitle": "pre-1995 Enforcement Reports",
      "href": "http://web.archive.org/web/20021016232331/http://www.fda.gov/po/enforceindex/oldenforce.html"
    }
  ];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const urlNumb = x; // put a number here
  const url = urls[urlNumb].href;
  console.log("crawling: " + url);
  await page.goto(url);

  const addresses = await page.evaluate(() =>
    Array.from(document.querySelectorAll("li a")).map(link => ({
      "text": link.text,
      "href": link.href
    }))
  );

  const filtered = addresses.filter(m => m.text.includes('Date Released'));
  const replaced = filtered.map(i => ({
    "text": i.text.replace(' \n  ', ' '),
    "href": i.href
  }));


  var data = JSON.stringify(replaced);

  fs.writeFile(`links/${urls[urlNumb].urlTitle}-link.json`, data, finished);

  function finished(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
  }

  await browser.close();
})();