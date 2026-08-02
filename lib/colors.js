const ansi = require('bare-ansi-escapes')
const process = require('process')

const { modifierReset, modifierBold, modifierDim } = ansi

const STYLES = {
  green: ansi.colorGreen,
  red: ansi.colorRed,
  yellow: ansi.colorYellow,
  gray: ansi.colorBrightBlack,
  bold: modifierBold,
  dim: modifierDim,
  boldGreen: modifierBold + ansi.colorGreen,
  boldRed: modifierBold + ansi.colorRed,
  boldYellow: modifierBold + ansi.colorYellow
}

const NAMES = Object.keys(STYLES)

function identity(string) {
  return string
}

function env(name) {
  try {
    return process.env?.[name]
  } /* c8 ignore next */ catch {
    /* c8 ignore next */
    return undefined
  }
}

function isColorSupported() {
  const noColor = env('NO_COLOR')
  if (noColor) return false

  const forceColor = env('FORCE_COLOR')
  if (forceColor !== undefined && forceColor !== '') {
    return forceColor !== '0' && forceColor !== 'false'
  }

  if (env('TERM') === 'dumb') return false

  try {
    return process.stdout?.isTTY === true
  } /* c8 ignore next */ catch {
    /* c8 ignore next */
    return false
  }
}

function paint(open) {
  return function (string) {
    string = string + ''
    if (string === '') return string
    // per line so that resets survive wrapping and indentation
    return string
      .split('\n')
      .map((line) => (line === '' ? line : open + line + modifierReset))
      .join('\n')
  }
}

function createColors(enabled = isColorSupported()) {
  const colors = { enabled: !!enabled }
  for (const name of NAMES) {
    colors[name] = enabled ? paint(STYLES[name]) : identity
  }
  return colors
}

module.exports = { createColors, isColorSupported }
