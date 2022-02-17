export const getRandom = (forRandomArr, number) => {
  let arr = [...forRandomArr]
  arr = arr.filter((v, i, a) => a.findIndex((t) => t.question === v.question) === i)
  let n = number

  var result = new Array(n),
    len = arr.length,
    taken = new Array(len)
  if (n > len) {
    n = len
  }
  while (n--) {
    var x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  console.log(result.length)
  console.log(result.filter((v, i, a) => a.findIndex((t) => t.question === v.question) === i).length)
  return result
}
