const args = require('args')
const fs = require('fs')
const csv = require('csv-parser')
const chalk = require('chalk')

args.option('input', 'Input filename', 'example_input.csv')
  .option('output', 'Output filename', 'output.csv')

const flags = args.parse(process.argv)

const inputFile = flags.input
const outputFile = flags.output

let names = []

fs.writeFileSync(outputFile, '')

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('headers', (headers) => {
    headers.shift()
    names = headers
  })
  .on('data', data => {
    let row = '';
    for (let i = 0; i < names.length; i++) {
      row = row + `${names[data[names[i]] - 1]},`
    }
    row = row.substring(0, row.length - 1);
    row = row + '\n'
    fs.appendFileSync(outputFile, row)
  })