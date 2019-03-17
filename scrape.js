const puppeteer = require("puppeteer");
const fs = require("fs");

async function run(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url.href);

    const text = await page.evaluate(() => document.querySelector('pre').innerText);

    let rgx = url.text.match(/\d{2,4}/g);
    let fileName = `text/Report-${rgx[2]}-${rgx[0]}-${rgx[1]}`;

    fs.writeFile(fileName, text, finish)

    function finish(e) {
        if (e) {
            console.log(`error occured in ${url}`, e);
        } else {
            console.log("success");
        }
    }

    browser.close();
}

const urls = [{
    "text": " ENFORCEMENT REPORT FOR 01 24 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00417.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 12 27 1995  ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00413.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 12 20 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00412.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 12 13 1995",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00411.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 11 29 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00409.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 11 22 1995",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00408.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 11 14 1995",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00407.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 11 08 1995",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00406.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 11 1 1995  ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00405.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 10 25 1995  ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00404.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 10 18 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00403.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 10 11 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00402.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 10 4 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00401.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 09 27 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00400.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 09 20 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00399.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 09 13 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00398.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 09 06 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00397.html"
}, {
    "text": " ENFORCEMENT REPORT for 08 30 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00396.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 08 23 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00395.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 08 16 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00394.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 08 09 1995  ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00393.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 08 02 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00392.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 07 26 1995  ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00391.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 07 19 1995  ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00390.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 07 12 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00389.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 07 05 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00388.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 06 28 1995  ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00387.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 06 21 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00384.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 06 14 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00383.html"
}, {
    "text": " ENFORCEMENT REPORT FOR 06 07 1995  ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00382.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 05 31 1995",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00381.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 05 24 1995 ",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00380.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 05 17 1995",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00386.html"
}, {
    "text": "ENFORCEMENT REPORT FOR 05 10 1995",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00385.html"
}, {
    "text": "Recalls and Field Corrections Foods Class III 05 03 1995 (Date Released 05/03/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00379.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 04 26 1995 (Date Released 04/26/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00378.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 04 19 1995 (Date Released 04/19/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00377.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 04 12 1995 (Date Released 04/12/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00376.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 04 05 1995 (Date Released 04/05/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00375.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 03 29 1995 (Date Released 03/29/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00373.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 03 22 1995 (Date Released 03/22/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00371.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 03 15 1995 (Date Released 03/15/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00369.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 03 08 1995 (Date Released 03/08/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00368.html"
}, {
    "text": "Recalls and Field Corrections Foods Class III 03 01 1995 (Date Released 03/01/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00367.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 02 22 1995 (Date Released 02/22/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00370.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 02 15 1995 (Date Released 02/15/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00365.html"
}, {
    "text": "Recalls and Field Corrections Foods Class II 02 08 1995 (Date Released 02/08/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00364.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 02 01 1995 (Date Released 02/01/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00363.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 01 25 1995 (Date Released 01/25/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00361.html"
}, {
    "text": "Recalls and Field Corrections Foods Class II 01 18 1995 (Date Released 01/18/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00360.html"
}, {
    "text": "Recalls and Field Corrections Foods Class II 01 11 1995 (Date Released 01/11/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00359.html"
}, {
    "text": "Recalls and Field Corrections Foods Class I 01 04 1995 (Date Released 01/04/1995)",
    "href": "http://web.archive.org/web/20021023190356/http://www.fda.gov/bbs/topics/ENFORCE/ENF00358.html"
}]

for (const eachlink of urls) {
    run(eachlink)
};