const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape(page) {
    try {
        const mainHtml = await request(page.href);
        const $ = cheerio.load(mainHtml);
        const text = $('pre').text().trim();

        const rgx = page.text.match(/\d{2,4}/g);
        const fileName = `text/Report-${rgx[2]}-${rgx[0]}-${rgx[1]}.txt`;

        fs.writeFile(fileName, text, function finish(err) {
            if (err) {
                console.log('error (while writing)', err.message);
            } else {
                console.log('successful')
            }
        });

    } catch (err) {
        console.log('error (in catch). URL:', err.options.uri);
    }
};


function fetchText() {

    fs.readFile('links/1995 Enforcement Reports-link.json', function (err, contents) {
        if (err) {
            console.log('error while reading', err)
        } else {
            const links = JSON.parse(contents);
            for (let eachPage of links) {
                scrape(eachPage);
            };
            console.log(links.length);
        }
    });

}

fetchText();