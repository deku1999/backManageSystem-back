var express = require('express')
var router = require('./router/router')
var bodyParser = require('body-parser')
const cors = require('cors')
var app = express()
app.use('/public/',express.static('./public/'))
//post请求处理
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(router)
//错误接口请求
app.use((req, res, next) => {
    res.status(404).json({
        message: '接口不存在',
        code: 404
    })
})
//服务器报错
app.use((err,req,res,next) => {
    res.status(500).json({
        message: '服务器错误',
        code: 500
    })
})
app.listen(3000, function() {
    console.log("server is running in 3000")
})