exports['classic snapshot 1'] = `
1337
`

exports['inverted snapshot 1'] = `
1337
`

exports['snapshot of a symbol 1'] = `
<Symbol(1337)>
`

exports['snapshot of an Error 1'] = {
  "name": "Error",
  "message": "1337"
}

exports['snapshot of undefined 1'] = `
<undefined>
`

exports['snapshot of null 1'] = null

exports['snapshot of number 1'] = 1337

exports['snapshot of an object 1'] = {
  "value": "1337",
  "more": {
    "nesting": "props"
  }
}

exports['multiple snapshots 1'] = `
1337
`

exports['multiple snapshots 2'] = {
  "value": "1337"
}

exports['child snapshot > the child 1'] = `
1337
`
