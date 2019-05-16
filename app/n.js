const working_string = 'fax on 1/12/00'

let checkRGX = /(\d+)\/(\d+)\/(\d{2,4})/
let date = working_string.match(checkRGX)

if (date) {
    console.log(new Date(date[0]));
} else {
    console.log('null');
}

console.log(working_string[0])