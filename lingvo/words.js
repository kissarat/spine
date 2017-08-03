// s = document.createElement('script'); document.head.appendChild(s); s.src = '';

function frequency(text, regex = /([a-zа-яъёіїґ]+)/i) {
  if ('string' === typeof text) {
    text = text.trim().split(/\s+/)
  }
  const o = {}
  for (let word of text) {
    word = word.toLocaleLowerCase()
    word = regex.exec(word)
    if (word) {
      word = word[1]
      if (word in o) {
        o[word]++
      }
      else {
        o[word] = 1
      }
    }
  }
  return o
}

function sort(input, min = 1) {
  const array = []
  for (const word in input) {
    const frq = input[word]
    if (frq >= min) {
      array.push([word, frq])
    }
  }
  return array.sort((a, b) => b[1] - a[1])
}

function except(array, exclude) {
  return array.filter(a => exclude.indexOf(a) < 0)
}

function unique(array) {
  const result = []
  for(const word of array) {
    if (result.indexOf(word) < 0) {
      result.push(word)
    }
  }
  return result
}

function intercept(array, include) {
  return array.filter(a => include.indexOf(a) >= 0)
}

function byLength(a, b) {
  return a.length - b.length || a.localeCompare(b)
}

async function load(url) {
  const r = await fetch(url)
  const b = await r.blob()
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    reader.addEventListener('loadend', function (e) {
      resolve(e.target.result.trim().split(/\s+/))
    })
    reader.addEventListener('error', reject)
    reader.readAsText(b)
  })
}

function loadJsonp(url) {
  const callback = '_words' + ++window.wordsJsnopNumber
  const me = document.querySelector('script[src*="words.js"]').src.split('?')[0]
  return new Promise(function (resolve) {
    const script = document.createElement('script')
    script.src = me + `?callback=${callback}&url=` + btoa(url)
    window[callback] = resolve
    document.head.appendChild(script)
  })
}

async function loadDictionaries(o) {
  for(const name in o) {
    dict[name] = await loadJsonp(o[name])
  }
}

(function () {
  let preloadDictionaries = false
  for (const script of document.querySelectorAll('script[src*="words.js"]')) {
    const callback = /callback=([\w_]+)/.exec(script.src)
    const url = /url=([\w\/+]+)/.exec(script.src)
    if (callback && url) {
      load(atob(url[1]))
        .then(function (words) {
          script.remove()
          window[callback[1]](words)
          delete window[callback[1]]
        })
      return
    }
    else if (script.src.indexOf('dictionaries=1') > 0) {
      preloadDictionaries = true
    }
  }

  window.wordsJsnopNumber = 0
  window.dict = {}
  if (preloadDictionaries) {
    loadDictionaries({
      noun: 'https://cdn.rawgit.com/kissarat/bd30c324439cee668f0ac76732d6c825/raw/6a89d6f6d12e07155a415f39f0e232e5fee8520d/russian-mnemonic-words.txt',
      stop: 'https://cdn.rawgit.com/Alir3z4/stop-words/master/russian.txt'
    })
  }
})()
