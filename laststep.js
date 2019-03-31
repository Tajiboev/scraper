const fs = require('fs');
const Excel = require('exceljs');

var lastResult = [];

function createXLSX(last_arr) {
    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet('1995-11-29');

    worksheet.columns = [{
            header: 'date',
            key: 'date',
        },
        {
            header: 'category',
            key: 'category',
        },
        {
            header: 'class',
            key: 'class',
        },
        {
            header: 'name',
            key: 'name',
        }, {
            header: 'recall_number',
            key: 'recall_number',
        },
        {
            header: 'manufacturer',
            key: 'manufacturer',
        }, {
            header: 'distribution',
            key: 'distribution',
        }, {
            header: 'recall_date',
            key: 'recall_date',
        }, {
            header: 'recalled_by',
            key: 'recalled_by',
        }, {
            header: 'quantity',
            key: 'quantity',
        }, {
            header: 'reason',
            key: 'reason',
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

    workbook.xlsx.writeFile('excel-ready/1995/1995-11-29.xlsx', 'utf8')
        .then(function () {
            console.log("done writing XLSX, 1995-11-29")
        });

}

function getTheInfo(container) {
    container.forEach(element => {
        lastResult.push({
            "date": "1995-11-29",
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
    var pname = element.slice(pIndex, dIndex).replace("product", "").replace('\n', ' ');
    return pname;
}

function getManufaturer(element) {
    var mIndex = element.indexOf("manufacturer");
    var dotIndex = element.indexOf(".", mIndex);
    var manufacturer = element
        .slice(mIndex, dotIndex)
        .replace("manufacturer", "");
    return manufacturer;
}

function getDistribution(element) {
    var disIndex = element.indexOf("distribution");
    var dotIndex = element.indexOf(".", disIndex);
    var manufacturer = element
        .slice(disIndex, dotIndex)
        .replace("distribution", "");
    return manufacturer;
}

function getRecaller(element) {
    var recIndex = element.indexOf("recalledby");
    var dotIndex = element.indexOf(",", recIndex);
    var recaller = element
        .slice(recIndex, dotIndex)
        .replace("recalledby", "");
    return recaller;
}

function getQuantity(element) {
    var qIndex = element.indexOf("quantity");
    var dotIndex = element.indexOf(".", qIndex);
    var quantity = element.slice(qIndex, dotIndex).replace("quantity", "");
    return quantity;
}

function getReason(element) {
    var reaIndex = element.indexOf("reason");
    var dotIndex = element.indexOf(".", reaIndex);
    var commaIndex = element.indexOf(",", reaIndex);
    var reason = element.slice(reaIndex, dotIndex).replace("reason", "");
    if (reason.length < 15) {
        reason = element.slice(reaIndex, commaIndex).replace("reason", "");
    }
    return reason;
}

function getClass(element) {
    var classX = element.substr(element.indexOf("class"), 9);
    return classX;
}

function getCategory(element) {
    var categoryX = element
        .substr(element.indexOf("KEYWORDHERE:"), 17)
        .replace("KEYWORDHERE:", "");
    return categoryX;
}

function getRecallNumber(element) {
    var numIndex = element.indexOf("recall#");
    var dotIndex = element.indexOf(".", numIndex);
    var recallnumber = element.slice(numIndex, dotIndex).replace("recall#", "");
    return recallnumber;
}

function getRecallDate(element) {
    let rgx = /(January|February|March|April|May|June|July|August|September|October|November|December)\d+,\d{4}/i;
    var working_string = element.slice(element.indexOf("recalledby"), element.length);
    let rawDate = working_string.match(rgx);
    if (rawDate != null) {
        let initial = rawDate[0];

        let MM = initial.match(
            /(January|February|March|April|May|June|July|August|September|October|November|December)/i
        );
        let DD = initial.match(/\d{1,2}/);
        let YY = initial.match(/\d{4}/);
        let recalldate = MM[0] + " " + DD[0] + ", " + YY[0];
        return recalldate;
    } else {
        return "unknown recall date"
    }
};

function main() {
    fs.readFile("readytoprocess/Report-1995-11-29.json", function read(err, data) {
        if (err) {
            console.log("error while reading file", err);
        } else {
            var ready_to_process_array = JSON.parse(data)
            getTheInfo(ready_to_process_array);
        }
    });
};

main();