import Tabletop from 'tabletop'

export const getData = (url, foo, sheet) => {
  Tabletop.init({
    key: url,
    callback: (googleData) => {
      foo(googleData[sheet].elements)
    },
    simpleSheet: false,
  })
}
