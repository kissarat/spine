const fs = require('fs')

const template = fs.readFileSync(__dirname + '/template.html').toString('utf8')
const data = require('./energy')
  .sort((a, b) => a[0].localeCompare(b[0]))
  // .sort((a, b) => b[4] - a[4])

const strings = []
for (const row of data) {
  const cells = []
  for (const cell of row.slice(0, 5)) {
    let value = cell
    if ('number' === typeof cell) {
      if (!Number.isInteger(cell)) {
        const number = cell.toString().split('.')
        value = `${number[0]}<span>,${number[1]}</span>`
      }
      else if (0 === cell) {
        value = `<span>${cell}</span>`
      }
    }
    const lower = 'string' === typeof cell ? cell.toLocaleLowerCase() : cell
    cells.push(`<td title="${lower}">${value}</td>`)
  }
  const string = cells.join('')
  strings.push(`<tr>${string}</tr>`)
}

const html = template.replace('{data}', strings.join('\n'))
fs.writeFileSync(__dirname + '/energy/index.html', html)
