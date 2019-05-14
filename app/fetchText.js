const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape(page) {
    try {
        const mainHtml = await request(page.href);
        const $ = cheerio.load(mainHtml);
        const text = $('body').text().trim();

        let str = page.text
        let monthDay = str.match(/\d{1,2}/g)
        let year = str.match(/\d{4}/)
        let fileName = `${year[0]}-${monthDay[0]}-${monthDay[1]}`

        fs.writeFile(`text/2000/${fileName}.txt`, text, (err) => {
            if (err) {
                console.log('error (while writing)', err.message);
            } else {
                console.log('success');
            }
        });

    } catch (err) {
        console.log('error (in catch). URL:', err.message);
    }
};


const fetchText = (year) => {
    fs.readFile(`links/${year}-link.json`, (err, data) => {
        if (err) {
            console.log('error while reading', err.message)
        } else {
            let links = JSON.parse(data);
            for (let i = 50; i < 60; i++) {
                scrape(links[i]);
            }
        }
    });
}

fetchText(2000);