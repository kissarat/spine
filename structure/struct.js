const fs = require('fs')

module.exports = class Struct {
  constructor(schema) {
    this.schema = schema
    const offsets = {}
    let offset = 0
    for (const name in schema) {
      offsets[name] = offset
      offset += schema[name]
    }
    this.offsets = offsets

    const properties = {}

    for (const name in schema) {
      properties[name] = {
        get() {
          const offset = this.offsets[name]
          const size = this.schema[name]
          switch (this.schema[name]) {
            case 4:
              return this.buffer.readUInt32BE(offset)

            case 2:
              return this.buffer.readUInt16BE(offset)

            case 1:
              return this.buffer.readUInt8(offset)

            default:
              return this.buffer.slice(offset, offset + size)
          }
        }
      }
    }
    Object.defineProperties(this, properties)
  }

  create(buffer) {
    const object = Object.create(this)
    object.buffer = buffer
    return object
  }

  readFileSync(filename) {
    return this.create(fs.readFileSync(filename))
  }
}
