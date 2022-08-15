import brittle from '../index.js'

const actual = Object.keys(brittle)
const expected = [
  'Test',
  'test',
  'solo',
  'skip',
  'todo',
  'configure',
  'pause',
  'resume',
  'createTypedArray'
]

for (const exp of expected) {
  if (actual.indexOf(exp) === -1) {
    throw new Error('Expected export ' + exp + ' not found')
  }
}
