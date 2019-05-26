const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape(page) {
    try {
        const mainHtml = await request(page.href);
        const $ = cheerio.load(mainHtml);
        const text = $('body').text().trim();

        let nameArr = page.text.match(/(\d+)\/(\d+)\/(\d{2,4})/);
        let fileName = nameArr[1] > 12 ? `${nameArr[3]}-${nameArr[2]}-${nameArr[1]}` : `${nameArr[3]}-${nameArr[1]}-${nameArr[2]}`

        fs.writeFile(`text/pre-1995/${fileName}.txt`, text, (err) => {
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


const fetchText = year => {
    fs.readFile(`links/${year}-link.json`, (err, data) => {
        if (err) {
            console.log('error while reading', err.message)
        } else {
            let links = JSON.parse(data);
            for (let i = 240; i < 260; i++) {
                scrape(links[i]);
            }
        }
    });
}

fetchText('pre-1995');