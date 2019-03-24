const fs = require("fs");

function main() {
    fs.readFile("text/Report-1995-11-29.txt", "utf8", function read(err, data) {
        if (err) {
            console.log("error while reading file", err);
        } else {
            // Invoke the next step here however you like
            process(data);
            // console.log(data)
        }
    });
}

function process(text) {
    var transformed = transform(text);
    var date = getDate(transformed)
    var divided = divide(transformed)
}

function getDate(data) {
    var regex = /(January|February|March|April|May|June|July|August|September|October|November|December)\d{2},\d{4}/i;
    var rawDate = data.match(regex);
    var initial = rawDate[0];

    var MM = initial.match(
        /(January|February|March|April|May|June|July|August|September|October|November|December)/i
    );
    var DD = initial.match(/\d{2}/);
    var YY = initial.match(/\d{4}/);

    var date = MM[0] + " " + DD[0] + ", " + YY[0];
    return date;
}

function transform(theText) {
    var transformedText = theText
        .toLowerCase()
        .replace(/\s/g, "")
        .replace(/\./g, ".\n")
        .replace(/recallsandfieldcorrections/g, "THEKEYWORDHERE");

    return transformedText;
}



function divide(rawtext) {
    var arr = [];
    var keywordcount = rawtext.match(/KEYWORDHERE/g).length;

    var initialPosition = rawtext.indexOf("KEYWORDHERE");
    var nextPosition = rawtext.indexOf(
        "KEYWORDHERE",
        initialPosition + 1
    );
    arr.push(initialPosition);
    arr.push(nextPosition);
    for (let i = 0; i <= keywordcount; i++) {
        initialPosition = nextPosition;
        nextPosition = rawtext.indexOf("KEYWORDHERE", initialPosition + 1);
        if (!arr.includes(nextPosition) && nextPosition != -1) {
            arr.push(nextPosition);
        }
        if (nextPosition == -1) {
            arr.push(rawtext.length);
        }
    }
    var paragraphs = [];
    for (let n = 0; n < arr.length - 1; n++) {
        var keyword_to_keyword = rawtext.slice(arr[n], arr[n + 1]);
        paragraphs[n] = `${keyword_to_keyword}`;
    };

    var filtered_paragraphs = paragraphs.filter((elem) => {
        return elem.includes("KEYWORDHERE:drug") || elem.includes("KEYWORDHERE:bio") || elem.includes("KEYWORDHERE:device")
    })

    fs.writeFile(`paragraphs/Report-1995-11-29.txt`, filtered_paragraphs[0], finished);

    function finished(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("success in filtered paragraphs");
        }
    };
};

main();