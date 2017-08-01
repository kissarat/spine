const fs = require('fs')
const Struct = require('./struct')

for (const filename of fs.readdirSync(__dirname + '/types')) {
  const m = /^(.*).json$/.exec(filename)
  if (m) {
    const name = m[1]
    exports[name] = new Struct(require('./types/' + name))
  }
}

const KB = 1024
const MB = 1024 * KB
const GB = 1024 * MB
const TB = 1024 * GB
const PB = 1024 * TB
const EB = 1024 * PB
const ZB = 1024 * EB
const YB = 1024 * ZB

const sizeOrder = [KB, MB, GB, TB, PB, EB, ZB, YB]
