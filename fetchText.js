const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape(page) {
    try {
        const mainHtml = await request(page.href);
        const $ = cheerio.load(mainHtml);
        const text = $('body').text().trim();

        var str = page.text
        var str2 = str.slice(str.indexOf('Date Released ') + 14, str.length - 1)
        var arr1 = str2.match(/\d{1,2}/g)
        var arr2 = str2.match(/\d{4}/)
        var fileName = `${arr2[0]}-${arr1[0]}-${arr1[1]}`


        fs.writeFile(`text/pre-1995/${fileName}.txt`, text, function finish(err) {
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
            for (let i = 240; i < 255; i++) {
                scrape(links[i]);
            };
            // console.log(links.length);
        }
    });

}

fetchText();