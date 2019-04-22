const fs = require('fs');
const _ = require('lodash')
const Excel = require('exceljs')

const textjs = (filename) => {
    fs.readFile(`text/${year}/${filename}`, "utf8", (err, data) => {
        if (err) {
            console.error(`error while reading ${filename}`, err);
        } else {
            process(data);
        }
    });
}

const accumulatorArray = []
const process = (data) => {
    let transformedText = transform(data);
    let dividedAndFiltered = divideAndFilter(transformedText);
    for (i of dividedAndFiltered) {
        let extra = `${getCategory(i)} ${getClass(i)}`
        singlify(i, extra)
    } // gather to accumulatorArray
    getTheInfo(accumulatorArray)

}

const transform = (text) => {
    var transformed = text.toLowerCase().replace(/\s\s+/g, " ").replace(/([ ]{2,})/g, " ").replace(/\. /g, ".\n").replace(/Recalls and Field Corrections/gi, "KEYWORDHERE");
    return transformed;
}

const divideAndFilter = (rawtext) => {
    let keywordcount = rawtext.match(/KEYWORDHERE/g).length;
    let arr = [];

    let initialPosition = rawtext.indexOf("KEYWORDHERE");
    arr.push(initialPosition);
    let nextPosition = rawtext.indexOf(
        "KEYWORDHERE",
        initialPosition + 1
    );
    if (nextPosition != -1) {
        arr.push(nextPosition);
    }

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

    let paragraphs = [];
    for (let n = 0; n < arr.length - 1; n++) {
        var keyword_to_keyword = rawtext.slice(arr[n], arr[n + 1]);
        paragraphs[n] = `${keyword_to_keyword}`.replace(/(\r\n|\n|\r)/gm, " ");

    };

    let filtered_paragraphs = paragraphs.filter(elem => {
        return (
            elem.includes("KEYWORDHERE: drug") ||
            elem.includes("KEYWORDHERE: bio") ||
            elem.includes("KEYWORDHERE: device")
        );
    });

    return filtered_paragraphs
}

const singlify = (text, cc) => {
    let info = cc;
    let product = text.indexOf('product')
    if (product == -1) return
    let reason = text.indexOf('reason', product)
    let end = text.indexOf('.', reason)
    let single = text.slice(product, end)
    accumulatorArray.push(`${info} ${single}`)
    let remaining = text.replace(single, '').replace('.', '').trimLeft()
    singlify(remaining, info)
}

const getTheInfo = (container) => {
    var lastResult = container.map((element) => {
        return {
            date: `${working_file_name.replace("Report-", "").replace(".txt", "")}`,
            category: getCategory(element),
            class: getClass(element),
            name: getProductName(element),
            recall_number: getRecallNumber(element),
            manufacturer: getManufaturer(element),
            distribution: getDistribution(element),
            recall_date: getRecallDate(element),
            recalled_by: getRecaller(element),
            quantity: getQuantity(element),
            reason: getReason(element)
        }
    })
    createXLSX(lastResult);
};

const createXLSX = (last_arr) => {
    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet(
        `${working_file_name.replace(".txt", "")}`
    );

    worksheet.columns = [{
            header: "RECALL_CLASSIFICATION_DATE",
            key: "date"
        },
        {
            header: "PRODUCT_TYPE",
            key: "category"
        },
        {
            header: "CLASSIFICATION",
            key: "class"
        },
        {
            header: "RECALL_NUMBER",
            key: "recall_number"
        },
        {
            header: "PRODUCT",
            key: "name"
        },
        {
            header: "RECALLING_FIRM",
            key: "recalled_by"
        },
        {
            header: "MANUFACTURER",
            key: "manufacturer"
        },
        {
            header: "RECALL_INITIALIZATION_DATE",
            key: "recall_date"
        },
        {
            header: "REASON",
            key: "reason"
        },
        {
            header: "VOLUME",
            key: "quantity"
        },
        {
            header: "DISTRIBUTION",
            key: "distribution"
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
    }

    workbook.xlsx
        .writeFile(
            `excel/${year}/${working_file_name.replace(".txt", "")}.xlsx`,
            "utf8"
        )
        .then(function () {
            console.log("done writing to Excel file");
        });
} //--fn create excel end

const getClass = (element) => {
    let classX = element.substr(element.indexOf("class"), 9).replace("class", "");
    return _.words(classX.toUpperCase()).join(' ')
}

const getCategory = (element) => {
    let categoryX = element
        .substr(element.indexOf("KEYWORDHERE:"), 17)
        .replace("KEYWORDHERE:", "")
        .trim();

    switch (categoryX) {
        case "drug":
            categoryX = "Drugs";
            break;
        case "biol":
            categoryX = "Biologics";
            break;
        case "devi":
            categoryX = "Devices";
            break;
        default:
            categoryX = "N/A";
    }

    return beautify(categoryX);
}





const getProductName = (element) => {
    let pIndex = element.indexOf("product");
    let dIndex = element.indexOf(".", pIndex);
    if (dIndex - pIndex < 10) {
        dIndex = element.indexOf(",", pIndex);
    }
    let pname = element.slice(pIndex, dIndex).replace("product", "");
    return beautify(pname);
}

const getManufaturer = (element) => {
    let mIndex = element.indexOf("manufacturer");
    let dotIndex = element.indexOf(".", mIndex);
    if (dotIndex - mIndex < 15) {
        dotIndex = element.indexOf(",", mIndex);
    }
    let manufacturer = element
        .slice(mIndex, dotIndex)
        .replace("manufacturer", "");
    return beautify(manufacturer);
}

const getDistribution = (element) => {
    if (element.includes('distribution')) {
        let disIndex = element.indexOf("distribution");
        let dotIndex = element.indexOf(".", disIndex);
        let distribution = element
            .slice(disIndex, dotIndex)
            .replace("distribution", "");
        return beautify(distribution);
    } else {
        return 'N/A'
    }
}

const getRecaller = (element) => {
    let recIndex = element.indexOf("recalled by");
    let dotIndex = element.indexOf(",", recIndex);
    let recaller = element.slice(recIndex, dotIndex).replace("recalled by", "");
    return beautify(recaller);
}

const getQuantity = (element) => {
    let qIndex = element.indexOf("quantity");
    let reaIndex = element.indexOf("reason", qIndex);
    let quantity = element.slice(qIndex, reaIndex).replace("quantity", "");

    return beautify(quantity);
}

const getReason = (element) => {
    var reaIndex = element.indexOf("reason");
    var dotIndex = element.indexOf(".", reaIndex);
    var commaIndex = element.indexOf(",", reaIndex);
    if (dotIndex == element.length) {
        var reason = element.slice(reaIndex, element.length);
    } else {
        var reason = element.slice(reaIndex, dotIndex);
    }

    if (reason.length < 15) {
        reason = element.slice(reaIndex, commaIndex);
    }
    return beautify(reason.replace("reason", ""));
}

const getRecallNumber = (element) => {
    let numIndex = element.indexOf("recall #");
    let dotIndex = element.indexOf(".", numIndex);
    let recallnumber = element
        .slice(numIndex, dotIndex)
        .replace("recall #", "")
        .trim();
    return recallnumber;
}

const getRecallDate = (element) => {
    let working_string = element.slice(
        element.indexOf("recalled by"),
        element.length
    );

    let rgxMM = working_string.match(
        /(January|February|March|April|May|June|July|August|September|October|November|December)/i
    );
    let rgxDD = working_string.match(/\d{1,2}/);
    let rgxYY = working_string.match(/\d{4}/);

    let recalldate = "N/A";

    if (rgxMM != null && rgxMM != null && rgxYY != null) {
        recalldate = `${rgxMM[0]} ${rgxDD[0]}, ${rgxYY[0]}`;
    }

    return beautify(recalldate);
};

const beautify = (text) => {
    return _.words(text).map(word => _.capitalize(word)).join(' ')
}


const year = "1995";
const files = fs.readdirSync(`text/${year}`);
var nm = 10;
var working_file_name = files[nm];
console.log(working_file_name);

textjs(working_file_name);

var errorFilesPre1995 = ["total 253"];
var errorFiles1995 = ['02-22', '03-22', '03-29'];
var errorFiles1996 = [32, "total50"];
var errorFiles1997 = [13, 17, 20, "total53"];
var errorFiles1998 = [5, 11, 24, 49, "total52"];
var errorFiles1999 = [
    "32-0-products+solved",
    "47 may have problem with rec#",
    "total51"
];
//checking for 1st dot (.) after reason can be errorprone
// MOST ERRORS MUST HAVE BEEN RESOLVED WITH IF STATEMENT IN LOOKFORMULTIPLES(i)
var errorFiles2000 = ["no-errors", "total52"];