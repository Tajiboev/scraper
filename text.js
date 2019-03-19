const fs = require("fs");

function main() {
    fs.readFile("raw/1.txt", "utf8", function read(err, data) {
        if (err) {
            console.log(err);
        }
        content = data;

        // Invoke the next step here however you like
        processFile();
    });
}


function processFile() {

    var transformedText = content.replace(/\s/g, "").replace(/\./g, ". \n");

    // // get the date
    var regex = /(January|February|March|April|May|June|July|August|September|October|November|December|)\d{2},\d{4}/i;
    var rawDate = transformedText.match(regex);
    var initial = rawDate[0];

    var MM = initial.match(/(January|February|March|April|May|June|July|August|September|October|November|December|)/i);
    var DD = initial.match(/\d{2}/);
    var YY = initial.match(/\d{4}/);

    var date = MM[0] + " " + DD[0] + ", " + YY[0];
    row.push(date);
};