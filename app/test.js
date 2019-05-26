const get = require('./get')

// collect all needed information for each product
const testString = 'start biologics class II product Glue recall #z-122-23 code #ssf'
const page = {
    'key': 'value',
    "text": "Recalls and Field Corrections Drugs Class III 11 31 1994 (Date Released 11/31/1994)"
}

// console.log(nameArr[2])
let fileName = nameArr[1] > 12 ? `${nameArr[3]}-${nameArr[1]}-${nameArr[2]}` : `${nameArr[3]}-${nameArr[2]}-${nameArr[1]}`

let nameArr = page.text.match(/(\d+)\/(\d+)\/(\d{2,4})/);

console.log(nameArr)