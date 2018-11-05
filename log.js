// 日志

const log4js = require('log4js')

log4js.configure({
 "appenders": {
    "err": {
      "type": "datefile",
      "filename": "logs/errors.log",
      // "layout": {
      // 	"type": "colored" 
      // }
    }
  },
  "categories": {
    "default": { "appenders": [ "err" ], "level": "DEBUG" },
  }
}) 

module.exports = log4js