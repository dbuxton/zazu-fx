const mathjs = require('mathjs')
const numeral = require('numeral')
const request = require('request')

const currencyMap = {
  'GBP': '£',
  'USD': '$',
  'CAD': 'C$',
  'HKD': 'H$',
  'SGD': 'S$',
}

module.exports = (pluginContext) => {
  return {
    respondsTo: (query) => {
      return query.match(/\sin\s/)
    },
    search: (query, env = {}) => {
      return new Promise((resolve, reject) => {
        parseRegex = /([0-9,.]+)\s*([a-zA-Z]{3})\sin\s([a-zA-Z]{3}\b)/
        parsed = query.match(parseRegex)
        number = parsed[1]
        fromCurrency = parsed[2]
        toCurrency = parsed[3]
        uri = {
          url: "http://api.fixer.io/latest",
          qs: {
            base: fromCurrency,
            symbols: toCurrency
          }
        }
        console.debug(parsed)
        request(uri, (error, response, body) => {
          const decoded = JSON.parse(body)
          const exchangeRate = decoded.rates[toCurrency]
          const answer = (numeral(exchangeRate) * numeral(parsed)).toString()
          const title = answer.replace(/\d+/, (v) => {
            return numeral(v).format('0,0')
          })
          resolve([
            {
              icon: 'fa-usd',
              title: title,
              subtitle: 'Select item to copy the value to the clipboard.',
              value: value,
            },
          ])
        })
      })
    }
  }
}
