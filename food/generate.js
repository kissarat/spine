const fs = require('fs')

const template = fs.readFileSync(__dirname + '/template.html').toString('utf8')
const data = require('./energy')
  .sort((a, b) => a[0].localeCompare(b[0]))
// .sort((a, b) => b[4] - a[4])

const strings = []
const qt = {}
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
    let lower = cell
    if ('string' === typeof cell) {
      lower = cell.toLocaleLowerCase()
        .replace(/[^[a-zа-яъыіїґ\s]+/igu, '')
        .replace(/\s+/g, ' ')
        .trim()
      for (const key of lower.split(' ')) {
        if (!(key in qt)) {
          qt[key] = 0
        }
        qt[key]++
      }
    }
    cells.push(`<td title="${lower}">${value}</td>`)
  }
  const string = cells.join('')
  strings.push(`<tr>${string}</tr>`)
}

const qz = []
for (const key in qt) {
  const v = qt[key]
  if (key.length > 2 && !/\w/.test(key)) {
    qz.push([key, v])
  }
}
qz.sort((a, b) => b[1] - a[1])

const html = template
  .replace('{data}', strings.join('\n'))
  .replace('"dict"', JSON.stringify(qz.map(a => a[0]).slice(0, 1000)))
fs.writeFileSync(__dirname + '/energy/index.html', html)

const sql = ['INSERT INTO food(name, proteins, lipids, сarbohydrates, energy, type) VALUES']
    .concat(data.map(function (r) {
      const name = r[0].replace(/"/g, '""')
      if (!(r[4] >= 0)) {
        r[5] = r[4]
        r[4] = 0
      }
      const type = r[5] ? `'${r[5]}'` : 'null'
      return `("${name}", ${r[1]}, ${r[2]}, ${r[3]}, ${r[4]}, ${type})`
    }).join(',\n'))
    .join('\n')
  + ';'

fs.writeFileSync(__dirname + '/energy/index.sql', sql)
