const b4a = require('b4a')
const { fileURLToPath } = require('url')

exports.createTypedArray = function (TypedArray, src) {
  const b = b4a.from(src, 'base64')
  return new TypedArray(b.buffer, b.byteOffset, b.byteLength / TypedArray.BYTES_PER_ELEMENT)
}

exports.getSnapshot = function (filename, key, actual) {
  let snap = {}

  const p = split(filename)
  if (!p) return actual

  try {
    snap = require(p.filename)
  } catch {}

  if (snap[key] !== undefined) return snap[key]

  snap[key] = actual

  const fs = requireMaybe('fs')
  if (!fs) return actual

  try {
    fs.mkdirSync(p.dirname)
  } catch {}

  let brittle = false
  let s = ''

  for (const k of Object.keys(snap)) {
    s += 'exports[' + toString(k) + '] = '

    const v = snap[k]

    if (isTypedArray(v)) {
      if (!brittle) {
        brittle = true
        s = "const { createTypedArray } = require('brittle')\n\n" + s
      }
      const b = b4a.from(v.buffer, v.byteOffset, v.byteLength)
      s +=
        'createTypedArray(' +
        v.constructor.name +
        ', ' +
        toString(b4a.toString(b, 'base64')) +
        ')\n\n'
    } else {
      s += toString(v) + '\n\n'
    }
  }
  s = '/* eslint-disable */\n\n' + s + '/* eslint-enable */\n'

  fs.writeFileSync(p.filename, s)
  return actual
}

function isTypedArray(v) {
  return !!(v && v.BYTES_PER_ELEMENT)
}

function toString(s) {
  if (typeof s !== 'string') return JSON.stringify(s, null, 2)
  // Multiline strings read best as template literals, but `\`, `` ` `` and `${`
  // must be escaped or they corrupt the value when the snapshot is re-required.
  // Template literals normalize CR/CRLF to LF, so skip them when there's a `\r`.
  if (s.indexOf('\n') !== -1 && s.indexOf('\r') === -1) {
    return '`' + s.replace(/[\\`]/g, '\\$&').replace(/\$\{/g, '\\${') + '`'
  }
  // Single quotes only for plain strings — no quote, backslash, or line
  // terminator. Everything else falls through to JSON, which escapes faithfully.
  if (!/['"\\\r\n]/.test(s)) return "'" + s + "'"
  return JSON.stringify(s, null, 2)
}

function split(filename) {
  if (filename.startsWith('file://')) filename = fileURLToPath(filename)

  const a = filename.lastIndexOf('/')
  const b = filename.lastIndexOf('\\')
  const sep = a > b ? '/' : '\\'
  const i = a > b ? a : b

  if (i === -1) return null

  const dirname = filename.slice(0, i) + sep + 'fixtures'

  return {
    dirname,
    filename: dirname + sep + filename.slice(i + 1).replace(/\.[^.]+$/, '') + '.snapshot.cjs'
  }
}

function requireMaybe(name) {
  try {
    return require(name)
  } catch {
    return null
  }
}
