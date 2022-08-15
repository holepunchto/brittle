const { IS_NODE } = require('./constants')
const b4a = require('b4a')

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
        s = 'const { createTypedArray } = require(\'brittle\')\n\n' + s
      }
      const b = b4a.from(v.buffer, v.byteOffset, v.byteLength)
      s += 'createTypedArray(' + v.constructor.name + ', ' + toString(b4a.toString(b, 'base64')) + ')\n\n'
    } else {
      s += toString(v) + '\n\n'
    }
  }
  s = '/* eslint-disable */\n\n' + s + '/* eslint-enable */\n'

  fs.writeFileSync(p.filename, s)
  return actual
}

function isTypedArray (v) {
  return !!(v && v.BYTES_PER_ELEMENT)
}

function toString (s) {
  if (typeof s === 'string' && s.indexOf('\n') > 0 && s.indexOf('`') === -1) return '`' + s + '`'
  if (typeof s === 'string' && s.indexOf('"') === -1) return '\'' + s + '\''
  return JSON.stringify(s, null, 2)
}

function split (filename) {
  if (filename.startsWith('file://')) filename = filename.slice(7)

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

function requireMaybe (name) {
  if (!IS_NODE) return null

  try {
    return require(name)
  } catch {
    return null
  }
}
