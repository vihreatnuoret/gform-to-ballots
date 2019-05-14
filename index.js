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
let first = ''

fs.writeFileSync(outputFile, '')

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('headers', (headers) => {
    first = headers.shift()
    names = headers
  })
  .on('data', data => {
    let row = '';
    let rowData = []
    for (let name in data) {
      if (name != first) {
        let position = data[name]
        rowData[position - 1] = name
      }
    }

    rowData.forEach(name => {
      row = row + `${name},`
    })
    row = row.substring(0, row.length - 1);
    row = row + '\n'
    fs.appendFileSync(outputFile, row)
  })