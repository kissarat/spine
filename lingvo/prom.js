const http = require('http')
const {JSDOM} = require('jsdom')
const request = require('request-promise')
const qs = require('querystring')

function setupDOMUtils(window) {
  const document = window.document

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

  function entities(name = 'Product', fn = properties) {
    return [].map.call(document.querySelectorAll(`[itemtype="http://schema.org/${name}"]`), fn)
  }

  return {entities, properties}
}

const server = http.createServer(async function (req, res) {
  let status = 200
  let data
  try {
    const url = 'http://prom.ua' + req.url
    const headers = {'x-requested-with': 'XMLHttpRequest'}
    for(const header of ['cookie', 'user-agent']) {
      headers[header] = req.headers[header]
    }
    const body = await request({url, headers})
    const prom = JSON.parse(body)
    const {window} = new JSDOM(`<html><body>${prom.products_html}</body></html>`)
    const products = setupDOMUtils(window).entities()
    for(const product of products) {
      if (product.url) {
        const parts = product.url.split('?')
        if (parts[1]) {
          const params = qs.parse(parts[1])
          for (const key in params) {
            if (['token', 'source', 'variant', 'locale'].indexOf(key) < 0) {
              product[key] = params[key]
            }
          }
        }
      }
    }
    data = {products}
    if (prom.deferred_payloads) {
      data.deferred_payloads = prom.deferred_payloads
    }
    if (prom.targeting_params) {
      data.targeting_params = prom.targeting_params
    }
  }
  catch (ex) {
    status = ex.statusCode || 500
    data = {
      error: {
        message: ex.message || ex.toString()
      }
    }
  }
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf8'
  })
  res.end(JSON.stringify(data))
})

const port = +process.argv[process.argv.length - 1] || 8080
server.listen(port, function () {
  console.log(`Listen at http://localhost:${port}/`)
})
