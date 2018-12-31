
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const api = require('./router/api.js')


mongoose.connect('mongodb://localhost/SINA', { useNewUrlParser: true })
	.then(res => console.log('数据库连接成功'))
	.catch(err => console.log(err))
mongoose.Promise = global.Promise

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api', api)

http.createServer(app).listen(8021, () => {
	console.log(process.env.NODE_ENV === 'production' ? '生产环境' : '开发环境')
	console.log('Http server listening on port 8021')
})
