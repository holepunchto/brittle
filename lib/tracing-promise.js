const activePromises = new Map()

class TracingPromise extends Promise {
  constructor (fn) {
    const stack = (new Error()).stack
    let deleted = false

    addStack(stack)

    super((resolve, reject) => {
      const innerResolve = (value) => {
        if (!deleted) {
          deleted = true
          deleteStack(stack)
        }
        resolve(value)
      }
      const innerReject = (err) => {
        if (!deleted) {
          deleted = true
          deleteStack(stack)
        }
        reject(err)
      }

      return fn(innerResolve, innerReject)
    })
  }

  static Untraced = Promise

  static enable () {
    global.Promise = TracingPromise
  }

  static print () {
    if (activePromises.size === 0) {
      console.error('(All promises are resolved)')
      return
    }
    for (const [stack, count] of activePromises) {
      const lines = stack.split('\n')
      lines.shift()
      lines.shift()

      const trace = lines.map((line) => {
        line = line.slice(7)
        if (/\(node:[^(]*\)$/.test(line)) return null
        if (line.startsWith('TracingPromise.then ')) return null
        return '  at ' + line
      }).filter(x => x).join('\n')

      if (!trace) continue

      console.error(count + ' promise' + (count === 1 ? '' : 's') + ' unresolved')
      console.error(trace)
      console.error()
    }
  }
}

module.exports = TracingPromise

function addStack (s) {
  activePromises.set(s, (activePromises.get(s) || 0) + 1)
}

function deleteStack (s) {
  const n = activePromises.get(s)
  if (n === 1) activePromises.delete(s)
  else activePromises.set(s, n - 1)
}
