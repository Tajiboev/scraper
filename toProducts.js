const fs = require("fs");

function main() {
    fs.readFile("paragraphs/Report-1995-11-29.txt", "utf8", function read(err, data) {
        if (err) {
            console.log("error while reading file", err);
        } else {
            // Invoke the next step here however you like
            processText(data);
        }
    });
};


function processText(data) {
    console.log(data)
}

main();