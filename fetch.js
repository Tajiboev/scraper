const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape(page) {
    try {
        const mainHtml = await request(page.href);
        const $ = cheerio.load(mainHtml);
        let text = $('body').text().trim();

        let rgx = page.text.match(/\d{2,4}/g);
        let rgx2 = page.text.match(/\d+/g);
        let fileName = `text/pre-1995/Report-${rgx[2]}-${rgx[0]}-${rgx[1]}.txt`;
        if (fileName.includes('undefined')) {
            fileName = `text/pre-1995/Report-${rgx2[2]}-${rgx2[0]}-${rgx2[1]}.txt`;
        }

        fs.writeFile(fileName, text, function finish(err) {
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


function fetchText() {

    fs.readFile('links/pre-1995-link.json', function (err, contents) {
        if (err) {
            console.log('error while reading', err)
        } else {
            const links = JSON.parse(contents);
            for (let i = 250; i < 255; i++) {
                scrape(links[i]);
            };
            console.log(links.length);
        }
    });

}

fetchText();