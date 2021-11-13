export function uniq(a) {
  var seen = {}
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true)
  })
}

export const conslog = (name, object) => {
  console.group(name)
  Object.keys(object).forEach((par) => {
    console.log(`opt: ${par}: val: ${object[par]}`)
  })
  console.groupEnd()
}

export const verifyFields = (object) => {
  const result = Object.keys(object).map((par) => {
    if (!object[par] || object[par] === '') {
      return 'error'
    }
  })
  if (result.includes('error')) {
    return false
  } else {
    return true
  }
}
