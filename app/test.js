const get = require('./get')

// collect all needed information for each product
const testString = 'start biologics class II product Glue recall #z-122-23 code #ssf'

console.log(get)
console.log(get.class(testString))
console.log(get.category(testString))
console.log(get.recallNumber(testString))