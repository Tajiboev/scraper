const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');


var done = [];

async function scrape(page) {
    try {
        const mainHtml = await request(page.href);
        const $ = cheerio.load(mainHtml);
        const text = $('pre').text().trim();

        const rgx = page.text.match(/\d{2,4}/g);
        const fileName = `text/Report-${rgx[2]}-${rgx[0]}-${rgx[1]}.txt`;

        fs.writeFile(fileName, text, finish);

        function finish(e) {
            if (e) {
                console.log('rror while writing to file', e)
            } else {
                done.push(fileName)
                console.log('success in', done.length);
            };
        };

    } catch (e) {
        console.log('error occured in catch', e);
    }
};


function main() {

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

main();