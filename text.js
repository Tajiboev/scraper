const fs = require("fs");

function main() {
    fs.readFile("text/Report-1995-11-29.txt", "utf8", function read(err, data) {
        if (err) {
            console.log("error while reading file", err);
        } else {
            // Invoke the next step here however you like
            processText(data);
            // console.log(data)
        }
    });
}

function processText(text) {
    getDateFrom(text);
}

function getDateFrom(theText) {
    var transformedText = theText
        .toLowerCase()
        .replace(/\s/g, "")
        .replace(/\./g, ".\n")
        .replace(/recallsandfieldcorrections/g, "THEKEYWORDHERE");

    // // get the date
    var regex = /(January|February|March|April|May|June|July|August|September|October|November|December)\d{2},\d{4}/i;
    var rawDate = transformedText.match(regex);
    var initial = rawDate[0];

    var MM = initial.match(
        /(January|February|March|April|May|June|July|August|September|October|November|December)/i
    );
    var DD = initial.match(/\d{2}/);
    var YY = initial.match(/\d{4}/);

    var date = MM[0] + " " + DD[0] + ", " + YY[0];
    divide(transformedText);
    return date
}

function divide(textWithKeyword) {
    var arr = [];
    var keywordcount = (textWithKeyword.match(/KEYWORDHERE/g) || []).length;

    var initialPosition = textWithKeyword.indexOf("KEYWORDHERE");
    var nextPosition = textWithKeyword.indexOf(
        "KEYWORDHERE",
        initialPosition + 1
    );
    arr.push(initialPosition);
    arr.push(nextPosition);
    for (let i = 0; i <= keywordcount; i++) {
        initialPosition = nextPosition;
        nextPosition = textWithKeyword.indexOf("KEYWORDHERE", initialPosition + 1);
        if (!arr.includes(nextPosition) && nextPosition != -1) {
            arr.push(nextPosition);
        }
        if (nextPosition == -1) {
            arr.push(textWithKeyword.length);
        }
    }
    var paragraphs = [];
    for (let n = 0; n < arr.length - 1; n++) {
        var aParagraph = textWithKeyword.slice(arr[n], arr[n + 1]);
        paragraphs[n] = aParagraph;
    };

    var filtered_paragraphs = paragraphs.filter((elem) => {
        return elem.includes("KEYWORDHERE:drug") || elem.includes("KEYWORDHERE:bio") || elem.includes("KEYWORDHERE:device")
    })

    fs.writeFile(`paragraphs/Report-1995-11-29.txt`, filtered_paragraphs, finished);

    function finished(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("success in filtered paragraphs");
        }
    };
};

main();