const fs = require("fs");

const files = fs.readdirSync('text');
const file_name = files[0];

main(file_name);

function main(filename) {
    fs.readFile(`text/${filename}`, "utf8", function read(err, data) {
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
    var divided = divide(transformed)
}

function transform(theText) {
    var transformedText = theText
        .toLowerCase()
        .replace(/\s/g, "")
        .replace(/\./g, ".\n")
        .replace(/recallsandfieldcorrections/g, "KEYWORDHERE");

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
    });

    var to_prod_final_array = [];

    function lookForMultiples(item) {
        let number_of_reasons = item.match(/reason/g).length;
        let number_of_distributions = item.match(/distribution/g).length;

        if (number_of_reasons == number_of_distributions) {
            var number_of_products = number_of_reasons;
        };

        if (number_of_products > 1) {
            splitMultiples(item, number_of_products);
        } else if (number_of_products == 1) {
            to_prod_final_array.push(`${item}`)
        }
    };

    function splitMultiples(text, divisions) {
        var classX = getClass(text);
        var categoryX = getCategory(text)
        var position_start = text.indexOf("product");
        var position_of_reason = text.indexOf("reason", position_start)
        var position_end = text.indexOf(".", position_of_reason)

        for (let i = 0; i < divisions; i++) {
            var one_product = `${categoryX} + ${classX} + ${text.slice(position_start, position_end)}`;
            to_prod_final_array.push(one_product);

            position_start = text.indexOf("product", position_end);
            position_of_reason = text.indexOf("reason", position_start);
            position_end = text.indexOf(".", position_of_reason)
        };
    }

    function getClass(elem) {
        return elem.substr(elem.indexOf("class"), 9);
    }

    function getCategory(element) {
        var categoryX = element
            .substr(element.indexOf("KEYWORDHERE:"), 17)
        return categoryX;
    }

    for (i of filtered_paragraphs) {
        lookForMultiples(i)
    };

    console.log(`There are ${to_prod_final_array.length} products in 1995-11-29`);
    var data_to_prod = JSON.stringify(to_prod_final_array)

    fs.writeFile(`readytoprocess/${file_name}.json`, data_to_prod, finished);

    function finished(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`Success! Saved to readytoprocess/${file_name}.json! Plese procede to laststep.js`);
        }
    };
};