const fs = require("fs");

function main() {
    fs.readFile("text/Report-1995-01-04.txt", "utf8", function read(err, data) {
        if (err) {
            console.log('error while reading file', err);
        } else {
            // Invoke the next step here however you like
            processText(data);
            // console.log(data)
        }
    });
};

function processText(text) {
    // getDateFrom(text)
    divide(text)
}

function getDateFrom(theText) {
    var transformedText = theText.replace(/\s/g, "").replace(/\./g, ". \n");

    // // get the date
    var regex = /(January|February|March|April|May|June|July|August|September|October|November|December)\d{2},\d{4}/i;
    var rawDate = transformedText.match(regex);
    var initial = rawDate[0];

    var MM = initial.match(/(January|February|March|April|May|June|July|August|September|October|November|December)/i);
    var DD = initial.match(/\d{2}/);
    var YY = initial.match(/\d{4}/);

    var date = MM[0] + " " + DD[0] + ", " + YY[0];
    console.log(date);
};

function divide(rawText) {
    var transform = rawText.indexOf('RECALLS AND FIELD CORRECTIONS', 100000);
    // .replace(/\s/g, "").replace(/\./g, ". \n");
    console.log(transform)
}

main();