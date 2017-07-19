function objectDuplicates(o, b) {
  if (b) {
    const r = {}
    for (let i = 0; i < o.length; i++) {
      r[o[i]] = b[i]
    }
    o = r
  }
  console.log(o)
  const c = {}
  const reverse = {}
  for (const key in o) {
    const v = o[key]
    reverse[v] = key
    if (v in c) {
      c[v]++
    }
    else {
      c[v] = 1
    }
  }
  console.log(c)
  const result = []
  for (const key in c) {
    if (c[key] > 1) {
      const native = reverse[key]
      result.push([key, native, c[key]])
    }
  }
  console.log(result)
  return result.sort((a, b) => a[1].localeCompare(b[1]))
}

function duplicates(a) {
  const result = []
  for (const b of a) {
    if (a.indexOf(b) !== a.lastIndexOf(b) && result.indexOf(b) < 0) {
      result.push(b)
    }
  }
  return result
}

function indexes(a, v) {
  const result = []
  for (let i = 0; i < a.length; i++) {
    if (a[i] === v) {
      result.push(i)
    }
  }
  return result
}

function byIndexes(a, b) {
  return a.map(i => b[i])
}

function objectify(a, b) {
  const result = {}
  for (let i = 0; i < a.length; i++) {
    result[a[i]] = b[i]
  }
  return result
}

const a = [
  "просіювати",
  "замісити",
  "дати простоятись",
  "викласти",
  "сформувати",
  "приправляти",
  "намастити",
  "пекти",
  "остудити",

  "почистити",
  "нарізати",
  "відбивати",
  "маринувати",
  "закручувати",
  "панірувати",
  "жарити",
  "варити",
  "тушити",
  "начиняти",

  "промивати",
  "розбирати",
  "віділяти",
  "розрізати",
  "запікати",

  "додавати",
  "заправляти",
  "вирізати",

  "заливати"
]

const b = [
  "sift",
  "knead",
  "let stand",
  "lay out",
  "shape",
  "season",
  "flavor",
  "bake",
  "cool",

  "clean",
  "chop",
  "crack",
  "marinate",
  "twist",
  "pan",
  "fry",
  "cook",
  "braise",
  "stuff",

  "rinse",
  "disassemble",
  "reindeer",
  "cut",
  "parch",

  "add",
  "fill",
  "carve",

  "pour"
]
