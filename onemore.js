var lastResult = [];

function getTheInfo(container) {
    container.forEach(element => {
        lastResult.push({
            "date": "today",
            "category": getCategory(element),
            "class": getClass(element),
            "name": getProductName(element),
            "recall number": getRecallNumber(element),
            "manufacturer": getManufaturer(element),
            "distribution": getDistribution(element),
            "recall date": getRecallDate(element),
            "recalled by": getRecaller(element),
            "quantity": getQuantity(element),
            "reason": getReason(element)
        });
    });
    // console.log(lastResult);
};

function findMultiples() {
    let arrayContainer = [];
    return arrayContainer
};


function getProductName(element) {
    var pIndex = element.indexOf("product");
    var dIndex = element.indexOf(".", pIndex);
    var pname = element.slice(pIndex, dIndex).replace("product", "");
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
    var dotIndex = element.indexOf(".", recIndex);
    var manufacturer = element
        .slice(recIndex, dotIndex)
        .replace("recalledby", "");
    return manufacturer;
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
    var reason = element.slice(reaIndex, dotIndex).replace("reason", "");
    return reason;
}

function getClass(element) {
    var aclass = element.substr(element.indexOf("class"), 8);
    return aclass;
}

function getCategory(element) {
    var acategory = element
        .substr(element.indexOf("KEYWORDHERE:"), 17)
        .replace("KEYWORDHERE:", "");
    return acategory;
}

function getRecallNumber(element) {
    var numIndex = element.indexOf("recall#");
    var dotIndex = element.indexOf(".", numIndex);
    var recallnumber = element.slice(numIndex, dotIndex).replace("recall#", "");
    return recallnumber;
}

function getRecallDate(element) {
    let rgx = /(January|February|March|April|May|June|July|August|September|October|November|December)\d{2},\d{4}/i;
    let rawDate = element.match(rgx);
    let initial = rawDate[0];

    let MM = initial.match(
        /(January|February|March|April|May|June|July|August|September|October|November|December)/i
    );
    let DD = initial.match(/\d{2}/);
    let YY = initial.match(/\d{4}/);
    let recalldate = MM[0] + " " + DD[0] + ", " + YY[0];
    return recalldate;
}

var parray = [
    `KEYWORDHERE:foods--classiii========================_______________productleaderbrandoralelectrolytesolution,unflavored,in1-literor4-packof8ouncebottles.
    recall#f-056-6.
    codelot#5163or#5146inkedontopofbottle.
    manufactureruniversalindustries,columbus,mississippi.
    recalledbycardinalhealth,inc.
    ,dublin,ohio,bye-mailnoticeonoctober19,1995.
    firm-initiatedrecallongoing.
    distributionnationwide.
    quantityapproximately1,0001-literbottlesweredistributed.
    reasonproducthasanoff-colorpossiblyduetothepresenceofaspergillusniger.
    productleaderbrandoralelectrolytesolution22,unflavored,in1-literor4-packof8ouncebottles.
    recall#f-056-111.
    codelot#5163or#5146inkedontopofbottle.
    manufactureruniversalindustries,columbus,mississippi.
    recalledbycardinalhealth,inc.
    ,dublin,ohio,bye-mailnoticeonoctober19,1995.
    firm-initiatedrecallongoing.
    distributionnationwide.
    quantityapproximately1,0001-literbottlesweredistributed.
    reasonproducthasanoff-colorpossiblyduetothepresenceofaspergillusniger.`,
    `KEYWORDHERE:foods--classii========================_______________productleaderMEbrandoralelectrolytesolution,unflavored,in1-literor4-packof8ouncebottles.
    recall#f-056-66.
    codelot#5163or#5146inkedontopofbottle.
    manufactureruniversalindustries,columbus,mississippi.
    recalledbycardinalhealth,inc.
    ,dublin,ohio,bye-mailnoticeonoctober19,1995.
    firm-initiatedrecallongoing.
    distributionnationwide.
    quantityapproximately1,0001-literbottlesweredistributed.
    reasonproducthasanoff-colorpossiblyduetothepresenceofaspergillusniger.`
];

getTheInfo(parray);