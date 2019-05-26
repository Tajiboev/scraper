const _ = require('lodash');

const beautify = text => {
  return _.words(text, /[^, ]+/g)
    .map(word => _.capitalize(word))
    .join(" ")
    .trim();
};

String.prototype.remove = function (...args) {
  let initialString = this.toString();

  return args.reduce((acc, current) => {
    return acc.replace(current, "");
  }, initialString).trim();
};

const getters = {
  class: element => {
    let classX = element.slice(
      element.indexOf("class") + 5,
      element.indexOf("product")
    );
    return _.words(classX.toUpperCase()).join(" ");
  },
  
  category: element => {
    let category = element.substr(0, element.indexOf("class"));
    return beautify(category);
  },
  
  productName: element => {
    let start = element.indexOf("product");
    let maxend = element.indexOf("code", start);
    return beautify(
      element.slice(start, maxend).remove("product")
    )  
  },

  manufacturer: element => {
    let working_string = element
      .slice(
        element.indexOf("manufacturer"),
        element.indexOf("recalled by")
      )
      .remove('manufacturer')
    
    return beautify(working_string)
    // the code below is used for year 2002
      // .replace(/\b(by)\b/i, 'STOPHERE')
      // .replace(/(firm initiated recall)/i, 'STOPHERE');
    
    // let manufacturer = working_string.indexOf('manufacturer:');
    // let hasManufacturer = manufacturer != -1 ? true : false
    // let hasRecallingFirm = working_string.includes("recalling firm:")
  
    // let raw = '';
  
    // if (hasManufacturer && hasRecallingFirm) {
    //   raw = working_string.slice(manufacturer, working_string.length).remove('manufacturer:')
    //   if (raw.includes('STOPHERE')) {
    //     return beautify(raw.slice(0, raw.indexOf('STOPHERE')))
    //   } else {
    //     return beautify(raw)
    //   }
    // }
  
    // if (working_string.includes('STOPHERE')) {
    //   return beautify(working_string.slice(0, working_string.indexOf('STOPHERE')).remove('recalling firm: '))
    // } else {
    //   return beautify(working_string.remove('recalling firm: '))
    // }
    // it was used for 2002
  },
  
  recaller: element => {
    let working_string = element
      .slice(
        element.indexOf("recalled by"),
        element.indexOf("distribution")
      )
      .remove('recalled by')
      .replace(/\b(by)\b/i, 'STOPHERE')
      .replace(/(firm initiated recall)/i, 'STOPHERE');
  
    // used in 2002
    // let manufacturer = working_string.indexOf('manufacturer:');
    // let recallingFirm = working_string.indexOf('recalling firm:');
    // let hasManufacturer = manufacturer != -1 ? true : false
    // let hasRecallingFirm = working_string.includes("recalling firm:")
  
  
    // if (hasManufacturer && hasRecallingFirm) {
    //   raw = working_string.slice(recallingFirm, manufacturer).remove('recalling firm: ')
    //   if (raw.includes('STOPHERE')) {
    //     return beautify(raw.slice(0, raw.indexOf('STOPHERE')))
    //   } else {
    //     return beautify(raw)
    //   }
    // }
    // used in 2002
    return working_string.includes('STOPHERE') ? beautify(working_string.slice(0, working_string.indexOf('STOPHERE'))) : beautify(working_string)
  },

  distribution: element => {
    let pos_start = element.indexOf("distribution");
    let pos_end = element.indexOf("quantity", pos_start);
    let raw = element
      .slice(pos_start, pos_end)
      .remove("distribution");
    
    // used in 2002
    // let result = _.words(raw).map(word => {
    //   if (word.length < 3) {
    //     return word.toUpperCase()
    //   } else if (word.length > 3) {
    //     let temp = `${word[0].toUpperCase() + word.substr(1)}`
    //     return temp
    //   } else {
    //     return word
    //   }
    // }).join(' ')
    // used in 2002
    return beautify(raw)
  },
  
  recallDate: element => {
    let working_string = element.slice(
      element.indexOf("recalled by"),
      element.indexOf("distribution")
    );
  
    let checkRGX = /(\d+)\/(\d+)\/(\d{2,4})/;
    let date = working_string.match(checkRGX);
    if (date) {
      return date[0];
    }
  
    let recalldate = "NOT-FOUND";
  
    let rgxMM = working_string.match(
      /(January|February|March|April|May|June|July|August|September|October|November|December)/i
    );
    let rgxMMshort = working_string.match(
      /(Jan|Feb|March|April|May|June|July|Aug|Sep.|Oct|Nov|Dec)\./i
    );
  
    let rgxDD = working_string.match(/\d{1,2}/);
    let rgxYY = working_string.match(/\d{4}/);
  
  
    if (rgxMMshort != null) {
      return _.capitalize(rgxMMshort[0]) + ' ' + rgxDD[0] + ', ' + rgxYY[0]
    }
  
    if (rgxMM != null && rgxMM != null && rgxYY != null) {
      recalldate = `${_.capitalize(rgxMM[0])} ${rgxDD[0]}, ${rgxYY[0]}`;
    }
  
    return recalldate;
  },
  
  quantity: element => {
    let pos_start = element.indexOf("quantity");
    let pos_end = element.indexOf("reason");
    let raw = element.slice(pos_start, pos_end).remove('quantity')
    return pos_end != -1 ? beautify(raw) : beautify(element.slice(pos_start, element.length).remove('quantity'))
  },
  
  reason: element => {
    let pos_start = element.indexOf("reason");
    let pos_end = element.indexOf(".", pos_start);
    let raw = element.slice(pos_start, pos_end).remove("reason")
    if(raw.length < 25){
      raw = element.slice(pos_start, element.length).remove("reason")
    }
    return _.capitalize(raw)
  },

  recallNumber: element => {
    let working_string = element.slice(
      element.indexOf("product"),
      element.indexOf("code")
    );
  
    let checkRGX = /[a-z]-(\d+)(\/(\d+))?-(\d+)/i;
    let raw = working_string.match(checkRGX);
    if (raw) {
      return raw[0];
    } else {
      return working_string;
    }
  }
}


module.exports = getters