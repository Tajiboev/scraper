const fs = require("fs");

var products_array = [
  `KEYWORDHERE:drugs--classiii========================_______________productleader1brandoralelectrolytesolution,unflavored,in1-literor4-packof8ouncebottles.
    recall#f-056-6.
    codelot#5163or#5146inkedontopofbottle.
    manufactureruniversalindustries,columbus,mississippi.
    recalledbycardinalhealth,inc.
    ,dublin,ohio,bye-mailnoticeonoctober19,1995.
    firm-initiatedrecallongoing.
    distributionnationwide.
    quantityapproximately1,0001-literbottlesweredistributed.
    reasonproducthasanoff-colorpossiblyduetothepresenceofaspergillusniger.
    productleader2brandoralelectrolytesolution22,unflavored,in1-literor4-packof8ouncebottles.
    recall#f-056-111.
    codelot#5163or#5146inkedontopofbottle.
    manufactureruniversalindustries,columbus,mississippi.
    recalledbycardinalhealth,inc.
    ,dublin,ohio,bye-mailnoticeonoctober19,1995.
    firm-initiatedrecallongoing.
    distributionnationwide.
    quantityapproximately1,0001-literbottlesweredistributed.
    reasonproducthasanoff-colorpossiblyduetothepresenceofaspergillusniger.
    productleaderbrand3oralelectrolytesolution,unflavored,in1-literor4-packof8ouncebottles.
    recall#f-056-6.
    codelot#5163or#5146inkedontopofbottle.
    manufactureruniversalindustries,columbus,mississippi.
    recalledbycardinalhealth,inc.
    ,dublin,ohio,bye-mailnoticeonoctober19,1995.
    firm-initiatedrecallongoing.
    distributionnationwide.
    quantityapproximately1,0001-literbottlesweredistributed.
    reasonproducthasanoff-colorpossiblyduetothepresenceofaspergillusniger.
    productleaderbrand4oralelectrolytesolution22,unflavored,in1-literor4-packof8ouncebottles.
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

for (i of products_array) {
  lookForMultiples(i)
}

var data = JSON.stringify(to_prod_final_array)

fs.writeFile(`readytoprocess/ReadyForTheLastStep.json`, data, finished);

function finished(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("success");
  }
};