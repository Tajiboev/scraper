const fs = require("fs"),
      _ = require("lodash"),
      get = require('./get'), // methods for getting necessary information from a paragraph 
      Excel = require("exceljs"); // for exporting data to a spreadsheet


// remove first occurence of given argument(s) from a string
String.prototype.remove = function (...args) {
  let initialString = this.toString();

  return args.reduce((acc, current) => {
    return acc.replace(current, "");
  }, initialString).trim();
};

// make result look more beautiful
const beautify = text => {
  return _.words(text, /[^, ]+/g)
    .map(word => _.capitalize(word))
    .join(" ")
    .trim();
};


// read the file and initiate main logic
const textjs = filename => {
  fs.readFile(`text/${year}/${filename}`, "utf8", (err, data) => {
    if (err) {
      console.error(`error while reading ${filename}`, err);
    } else {
      process(data);
    }
  });
};

// main logic goes here
const accumulatorArray = [];

const process = data => {
  let transformedText = transform(data);
  let dividedAndFiltered = divideAndFilter(transformedText);
  
  for (i of dividedAndFiltered) {
    let extra = `${category(i)} class ${classification(i)}`;
    singlify(i, extra);
  }
  getTheInfo(accumulatorArray);
};

// manipulate the raw text to make it easier to work with
const transform = text => {
  let transformed = text
    .toLowerCase()
    .replace(/\s\s+/g, " ")
    .replace(/([ ]{2,})/g, " ")
    .replace(/\. /g, ".\n")
    .replace(/recalls and field corrections/gi, "KEYWORDHERE");
  return transformed;
};

// divide the transformed text to paragraphs that contain Biologics, Drugs or Devices
const divideAndFilter = rawtext => {
  let keywordcount = rawtext.match(/KEYWORDHERE/g).length;
  let arr = [];

  let initialPosition = rawtext.indexOf("KEYWORDHERE");
  arr.push(initialPosition);
  let nextPosition = rawtext.indexOf("KEYWORDHERE", initialPosition + 1);
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
  }

  let filtered_paragraphs = paragraphs.filter(elem => {
    return (
      elem.includes("KEYWORDHERE: drug") ||
      elem.includes("KEYWORDHERE: bio") ||
      elem.includes("KEYWORDHERE: device") ||
      elem.includes("KEYWORDHERE: medical device")
    );
  });

  return filtered_paragraphs;
};

const classification = element => {
  let classX = element.substr(element.indexOf("class"), 9).remove("class");
  return _.words(classX.toUpperCase()).join(" ");
};

const category = element => {
  let working_string = element.slice(0, element.indexOf('class'))
  let result = working_string.includes('bio') && 'Biologics' || working_string.includes('drug') && 'Drugs' || working_string.includes('device') && 'Devices'
  return result
};

// divide to single product
const singlify = (text, info) => {
  let working_string = text;
  let meta = info;
  if(working_string.includes('product') && working_string.includes('reason')){
    let pos_start = working_string.indexOf("product");
    let pos_check = working_string.indexOf("reason", pos_start);
    let pos_end = working_string.indexOf(".", pos_check);
    if (pos_end < 25) {
      pos_end = working_string.indexOf('product', pos_check)
    }
    if (pos_end == -1) {
      pos_end = working_string.length
    }
    let single = working_string.slice(pos_start, pos_end + 1);
    accumulatorArray.push(`${meta} ${single}`);
    let remaining = working_string.remove(single)
    if(remaining.includes('product') && remaining.includes('reason')){
      singlify(remaining, meta)
    }
  }
  // singlify(remaining, info);
};


// collect all needed information for each product
const getTheInfo = container => {
  let informationForEachProduct = container.map(product => {
    return {
      date: `${working_file_name.remove("Report-", ".txt")}`,
      category: get.category(product),
      class: get.class(product),
      name: get.productName(product),
      recall_number: get.recallNumber(product),
      manufacturer: get.manufacturer(product),
      distribution: get.distribution(product),
      recall_date: get.recallDate(product),
      recalled_by: get.recaller(product),
      quantity: get.quantity(product),
      reason: get.reason(product)
    };
  });
  createXLSX(informationForEachProduct);
};

// export information to an excel spreadsheet
const createXLSX = infoGathered => {
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

  for (i of infoGathered) {
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
}; //--fn create excel end


let year = "1993";
let files = fs.readdirSync(`text/${year}`);
let nm = 18;
const working_file_name = files[nm];
console.log(working_file_name, "working number:", nm);

const errorFiles = [{
  'year': '2002',
  'fileNumber': '30'
},{
  'year': '1993',
  'fileNumber': '48, 0'
}]

textjs(working_file_name);