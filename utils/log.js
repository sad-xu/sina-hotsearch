// 日志

const log4js = require('log4js')

log4js.configure({
 "appenders": {
    "err": {
      "type": "dateFile",
      "filename": "../logs/err.log",
    }
  },
  "categories": {
    "default": { "appenders": [ "err" ], "level": "DEBUG" },
  }
}) 

module.exports = log4js