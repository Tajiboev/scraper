const fs = require('fs');
const Excel = require('exceljs');
const directory = 'readytoprocess/1995'

const files = fs.readdirSync(directory);
const working_file_name = files[0];

var lastResult = [];

function createXLSX(last_arr) {
    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet(`${working_file_name.replace('.json', '')}`);

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

    workbook.xlsx.writeFile(`excel/1995/${working_file_name.replace('.json', '')}-try.xlsx`, 'utf8')
        .then(function () {
            console.log("done writing XLSX")
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
            "date": `${working_file_name.replace('Report-', '').replace('.json', '')}`,
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

function main(name) {
    fs.readFile(`${directory}/${name}`, function read(err, data) {
        if (err) {
            console.log("error while reading file", err);
        } else {
            var ready_to_process_array = JSON.parse(data)
            getTheInfo(ready_to_process_array);
        }
    });
};

main(working_file_name)