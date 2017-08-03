function setup(window) {
  const document = window.document
  function entities(name = 'Product') {
    return Array.from(document.querySelectorAll(`[itemtype="http://schema.org/${name}"]`))
  }

  function properties(entity) {
    const o = {}
    for (const element of entity.querySelectorAll('[itemprop]')) {
      let value
      if ('A' === element.tagName) {
        value = element.href
      }
      else if ('IMG' === element.tagName) {
        value = element.src
      }
      else {
        value = element.textContent.trim().replace(/\s+/g, ' ')
      }
      o[element.getAttribute('itemprop')] = value
    }
    return o
  }
  return {entities, properties}
}

module.exports = setup
