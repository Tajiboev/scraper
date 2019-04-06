const fs = require("fs");
const Excel = require('exceljs');

const files = fs.readdirSync('text/1995');
const nm = 54;
const working_file_name = files[nm];
console.log(nm);

textjs(working_file_name);

var errorFiles = [3, 20, 32, 33, 48, 49, 50, 'in year 1995', 'total 53']

function textjs(filename) {
    fs.readFile(`text/1995/${filename}`, "utf8", function read(err, data) {
        if (err) {
            console.log(`error while reading ${filename}`, err);
        } else {
            process(data);
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
        .replace(/([ ]{2,})/g, " ")
        .replace(/\./g, ".\n")
        .replace(/recalls and field corrections/ig, "KEYWORDHERE");
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
        return elem.includes("KEYWORDHERE: drug") || elem.includes("KEYWORDHERE: bio") || elem.includes("KEYWORDHERE: device")
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

    console.log(`There are ${to_prod_final_array.length} products in ${working_file_name}`);

    getTheInfo(to_prod_final_array)

};



var lastResult = [];

function createXLSX(last_arr) {
    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet(`${working_file_name.replace('.txt', '')}`);

    worksheet.columns = [{
            header: 'recall_classification_date',
            key: 'date',
        },
        {
            header: 'product_type',
            key: 'category',
        },
        {
            header: 'classification',
            key: 'class',
        }, {
            header: 'recall_number',
            key: 'recall_number',
        },
        {
            header: 'product',
            key: 'name',
        }, {
            header: 'recalling_firm',
            key: 'recalled_by',
        },
        {
            header: 'manufacturer',
            key: 'manufacturer',
        }, {
            header: 'recall_initiation_date',
            key: 'recall_date',
        }, {
            header: 'reason',
            key: 'reason',
        }, {
            header: 'volume',
            key: 'quantity',
        }, {
            header: 'distribution',
            key: 'distribution',
        }
    ];

    for (i of last_arr) {
        worksheet.addRow({
            date: i.date,
            category: i.category,
            class: i.class,
            name: i.name,
            recall_number: i.recall_number,
            manufacturer: i.manufacturer,
            distribution: i.distribution,
            recall_date: i.recall_date,
            recalled_by: i.recalled_by,
            quantity: i.quantity,
            reason: i.reason
        });
    };

    workbook.xlsx.writeFile(`excel/1995/${working_file_name.replace('.txt', '')}.xlsx`, 'utf8')
        .then(function () {
            console.log("done writing to Excel file")
        });
} //--fn create excel end

function beautify(text) {
    return text.split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
        .replace(/(\r\n|\n|\r)/gm, " ")
        .trim();
}

function getTheInfo(container) {
    container.forEach(element => {
        lastResult.push({
            "date": `${working_file_name.replace('Report-', '').replace('.txt', '')}`,
            "category": getCategory(element),
            "class": getClass(element),
            "name": getProductName(element),
            "recall_number": getRecallNumber(element),
            "manufacturer": getManufaturer(element),
            "distribution": getDistribution(element),
            "recall_date": getRecallDate(element),
            "recalled_by": getRecaller(element),
            "quantity": getQuantity(element),
            "reason": getReason(element)
        });
    });
    createXLSX(lastResult)
};

function getProductName(element) {
    var pIndex = element.indexOf("product");
    var dIndex = element.indexOf(".", pIndex);
    if (dIndex - pIndex < 10) {
        dIndex = element.indexOf(",", pIndex)
    }
    var pname = element.slice(pIndex, dIndex).replace("product", "");
    return beautify(pname);
}

function getManufaturer(element) {
    var mIndex = element.indexOf("manufacturer");
    var dotIndex = element.indexOf(".", mIndex);
    var manufacturer = element
        .slice(mIndex, dotIndex)
        .replace("manufacturer", "");
    return beautify(manufacturer);
}

function getDistribution(element) {
    var disIndex = element.indexOf("distribution");
    var dotIndex = element.indexOf(".", disIndex);
    var distribution = element
        .slice(disIndex, dotIndex)
        .replace("distribution", "");
    return beautify(distribution);
}

function getRecaller(element) {
    var recIndex = element.indexOf("recalled by");
    var dotIndex = element.indexOf(",", recIndex);
    var recaller = element
        .slice(recIndex, dotIndex)
        .replace("recalled by", "");
    return beautify(recaller);
}

function getQuantity(element) {
    var qIndex = element.indexOf("quantity");
    var dotIndex = element.indexOf(".", qIndex);
    var quantity = element.slice(qIndex, dotIndex).replace("quantity", "").trim();
    return quantity;
}

function getReason(element) {
    var reaIndex = element.indexOf("reason");
    var dotIndex = element.indexOf(".", reaIndex);
    var commaIndex = element.indexOf(",", reaIndex);
    if (dotIndex = element.length) {
        var reason = element.slice(reaIndex, element.length).replace("reason", "");
    } else {
        var reason = element.slice(reaIndex, dotIndex).replace("reason", "");
    };

    if (reason.length < 15) {
        reason = element.slice(reaIndex, commaIndex).replace("reason", "");
    }
    return beautify(reason);
}

function getClass(element) {
    var classX = element.substr(element.indexOf("class"), 9).replace("class", "");
    return classX.toUpperCase();
}

function getCategory(element) {
    var categoryX = element
        .substr(element.indexOf("KEYWORDHERE:"), 17)
        .replace("KEYWORDHERE:", "").trim()

    switch (categoryX) {
        case "drug":
            categoryX = 'Drugs';
            break;
        case "biol":
            categoryX = 'Biologics';
            break;
        case "devi":
            categoryX = 'Devices';
            break;
        default:
            categoryX = 'N/A'
    }

    return beautify(categoryX);
}

function getRecallNumber(element) {
    var numIndex = element.indexOf("recall #");
    var dotIndex = element.indexOf(".", numIndex);
    var recallnumber = element.slice(numIndex, dotIndex).replace("recall #", "").trim();
    return recallnumber;
}

function getRecallDate(element) {
    var working_string = element.slice(element.indexOf("recalled by"), element.length);

    let rgxMM = working_string.match(/(January|February|March|April|May|June|July|August|September|October|November|December)/i);
    let rgxDD = working_string.match(/\d{1,2}/);
    let rgxYY = working_string.match(/\d{4}/);

    if (rgxMM != null && rgxMM != null) {
        let recalldate = rgxMM[0] + " " + rgxDD[0] + ", " + rgxYY[0];
        return beautify(recalldate);
    } else {
        return "unknown recall date"
    }
};