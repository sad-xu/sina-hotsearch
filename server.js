
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

const api = require('./router/api.js')


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api', api)

http.createServer(app).listen(8021, () => {
	console.log(process.env.NODE_ENV === 'production' ? '生产环境' : '开发环境')
	console.log('Http server listening on port 8021')
})

