var express = require('express')
var connection = require('../db/sql')
var jwt = require('jsonwebtoken')
var router = express.Router()
var decode = require('../utils/decode')
var constant = require('../constant/index')
var pertree= require('../constant/perList')
var reportData = require('../constant/echarts')
var logisInfo = require('../constant/order')
const multer = require('multer')
const storage = multer.diskStorage({
    //存储的位置
    destination(req, file, cb){
        cb(null, 'public/')
    },
    //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
    filename(req, file, cb){
        cb(null,file.originalname)
    }
  })
  const upload = multer({storage})
//登录请求
router.post('/login', (req,res,next) =>{
    var data = req.body
    var {username, password} = data
    connection.query(`select * from logininfo where username='${username}' and password='${password}'`,(err,result,files) => {
        if(err) {
            return next(err)
        }
        if(result.length>0) {
            const token = jwt.sign(
                {username},     
                'robot',    //个性标志
                {expiresIn: 60*60}  //过期时间
            )
            res.status(200).json({
                message:'登录成功',
                code: 200,
                token
            })
        }
        else{
            res.json({
                message: '用户名或密码错误',
                code: 403
            })
        }

    })
})
//添加商品
router.get('/addgood', (req,res,next) => {
    let result = decode(req)
    if(result.code === 200) {
        let info = req.query
        let sql = `insert into goods(name,price,weight,time,imgurl)  values('${info.name}',${info.price},${info.weight},'${info.time}','${info.imgurl}')`
        connection.query(sql, (err,result,files) => {
            if(err) return next(err)
            res.status(200).json({code:200,message:'添加商品成功'})
        })
    }else{
        res.json(result)
    }
})
//上传图片
router.post("/uploadimg", upload.single('file'),(req,res,next)=>{
    const url = 'http://localhost:3000/public/' + req.file.filename
    res.status(200).json({code:200,url})
})
//删除商品
router.get('/deletegoods', (req,res,next) => {
    let result = decode(req)
    if(result.code === 200) {
        let sql = `delete from goods where id=${req.query.id}`
        connection.query(sql ,(err,result,files) => {
            if(err) return next(err)
            res.status(200).json({code:200,message:'删除商品成功'})
        })
    }else {
        res.json(result)
    }
})
//获取订单数据
router.get('/getgoods', (req,res,next) => {
    let result = decode(req)
    if(result.code === 200) {
        let info = req.query
        if(info.query === '') {
            let sql = 'select * from goods'
            connection.query(sql, (err,result,files) => {
                if(err) return next(err)
                let sum = result.length
                let start = (info.pagenum-1)*(info.pagesize)
                let end = start + (+info.pagesize)
                let tableData = result.slice(start, end)
                res.status(200).json({code: 200,result:tableData,total:sum,message:'获取数据成功'})
            })
        }else {
            let sql = `select * from goods where name like '%${info.query}%'`
            connection.query(sql, (err,result,files) => {
                if(err) return next(err)
                let sum = result.length
                let start = (info.pagenum-1)*(info.pagesize)
                let end = start + (+info.pagesize)
                let tableData = result.slice(start, end)
                res.status(200).json({code: 200,result:tableData,total:sum,message:'获取数据成功'})
            })
        }
    }else {
        res.json(result)
    }
})
//获取订单数据
router.get('/order', (req,res,next) => {
    let result = decode(req)
    if(result.code === 200) {
        let info = req.query
        if(info.query === '') {
            let sql = 'select * from orders'
            connection.query(sql, (err,result,files) => {
                if(err) return next(err)
                let sum = result.length
                let start = (info.pagenum-1)*(info.pagesize)
                let end = start + (+info.pagesize)
                let tableData = result.slice(start, end)
                tableData.forEach(item => {
                    item.order = logisInfo
                })
                res.status(200).json({code: 200,result:tableData,total:sum,message:'获取数据成功'})
            })
        }else {
            let sql = `select * from orders where orderid like '%${info.query}%'`
            connection.query(sql, (err,result,files) => {
                if(err) return next(err)
                let sum = result.length
                let start = (info.pagenum-1)*(info.pagesize)
                let end = start + (+info.pagesize)
                let tableData = result.slice(start, end)
                tableData.forEach(item => {
                    item.order = logisInfo
                })
                res.status(200).json({code: 200,result:tableData,total:sum,message:'获取数据成功'})
            })
        }
    }else {
        res.json(result)
    }
})
// 获取报表数据
router.get('/report', (req, res, next) => {
    let result = decode(req)
    if(result.code === 200) {
        res.status(200).json({result: reportData, message: '获取报表数据成功', code: 200})
    }else {
        res.json(result)
    }
})
//分配权限清单
router.get('/editpertree',  (req,res,next) => {
    let result = decode(req)
    if(result.code===200) {
        let info = req.query
        let sql = `update roleinfo set roleid='${info.treelist}' where id=${info.id}`
        connection.query(sql, (err,result, files) => {
            if(err) return next(err)
            res.status(200).json({code: 200, message: '角色分配权限成功'})
        })
    }else {
        res.json(result)
    }
})
// 获取权限树
router.get('/pertree', (req, res, next) => {
    let result = decode(req)
    if(result.code===200) {
        let obj = {
            code: 200,
            message: '获取权限树成功',
            result: pertree
        }
        res.status(200).json(obj)
    }else {
        res.json(result)
    }
})
// 分配角色请求
router.get('/allotrole', (req,res,next) => {
    let result = decode(req)
    if(result.code===200) {
        let info = req.query
        let sql = `update userinfo set role='${info.newRole}' where name='${info.name}'`
        connection.query(sql, (err,result,files) => {
            if(err) return next(err)
            res.status(200).json({code:200, message:'分配新角色成功'})
        })
    }else {
        res.json(result)
    }
})
//删除角色请求
router.get('/deleterole', (req,res, next) =>{
    let result = decode(req)
    if(result.code===200) {
        let sql = `delete from roleinfo where id=${req.query.id}`
        connection.query(sql, (err,result,files)=>{
            if(err) return next(err)
            res.status(200).json({code:200,message:'删除角色成功'})
        }) 
    }else { 
        res.json(result)
    }
})
// 编辑角色请求
router.post('/editrole', (req, res, next) => {
    const result = decode(req)
    if(result.code===200) {
        let info = req.body
        let sql = `update roleinfo set rolename='${info.name}',roledesc='${info.desc}' where id=${info.id}`
        connection.query(sql, (err,result,files) => {
            if(err) return next(err)
            res.status(200).json({code:200,message:'修改角色信息成功'})
        })
    }else{
        res.json(result)
    }
})
//添加角色请求
router.post('/addrole', (req, res, next) => {
    const result = decode(req)
    if(result.code===200) {
        let info = req.body
        let sql = `insert into roleinfo(rolename,roledesc)  values('${info.name}','${info.desc}')` 
        connection.query(sql, (err, result, files) => {
            if(err) return next(err)
            res.status(200).json({code: 200, message: '新增角色成功'})
        })
    }else {
        res.json(result)
    }
})
//获取角色信息请求
router.get('/getrole', (req,res,next) => {
    const result = decode(req)
    if(result.code===200) {
        let sql = `select * from roleinfo`
        connection.query(sql, (err, result, files) => {
            if(err) return next(err)
            res.status(200).json({code:200,message:'获取角色信息成功',result})
        })
    }else{
        res.json(result)
    }
})
//权限列表请求
router.get('/perlist', (req, res, next) => {
    const result = decode(req)
    if(result.code===200) {
        let sql = `select * from perinfo`
        connection.query(sql, (err, result, files) => {
            if(err) return next(err)
            let count = result.length
            let start = (req.query.pagenum-1)*(req.query.pagesize)
            let end = start + (+req.query.pagesize)
            let tableData = result.slice(start, end)
            res.status(200).json({count, tableData, code: 200, message: '获取权限列表成功'})
        })
    }else {
        res.json(result)
    }
})
//删除用户信息请求
router.get('/deleteuser',(req, res, next) => {
    const result = decode(req)
    if(result.code===200) {
        let username = result.decoded.username
        let sql = `select * from userinfo where name='${username}'`
        connection.query(sql, (err, result, files) => {
            if(err) return next(err)
            if(result.length > 0) {
                let {name} = req.query
                let sql2 = `delete from userinfo where name='${name}'`
                let sql3 = `delete from logininfo where username='${name}'`
                connection.query(sql3, (err, result3, files) => {
                    if(err) return next(err)
                    connection.query(sql2, (err,result2,files) => {
                        if(err) return next(err)
                        res.status(200).json({code: 200, message: '删除用户成功'})
                    })
                })

            }else {
                res.json({code: 0, message: '对不起你没有权限进行操作'})
            }
        })
    }else {
        res.json(result)
    }
})
//修改用户信息请求
router.post('/edituser', (req,res,next) => {
    const result = decode(req)
    if(result.code===200) {
        let username = result.decoded.username
        let sql = `select * from userinfo where name='${username}'`
        connection.query(sql, (err,result,files) => {
            if(err) return next(err)
            if(result.length > 0) {
                let {email, mobile ,name} = req.body
                let sql2 = `update userinfo set email='${email}',mobile='${mobile}' where name='${name}'`
                connection.query(sql2, (err, result2, files) => {
                    if(err) return next(err)
                    res.status(200).json({code: 200, message:'更新用户信息成功'})
                })
            }else {
                res.json({code: 0, message: '对不起你没有权限进行操作'})
            }
        })
    }else {
        res.json(result)
    }
})
//添加用户请求
router.post('/adduser', (req, res, next) => {
    const result = decode(req)
    if(result.code===200) {
        let username = result.decoded.username
        let sql = `select * from userinfo where name='${username}'`
        connection.query(sql, (err,result,files) => {
            if(err) return next(err)
            if(result.length > 0 ){
                console.log(req.body)
                let {name,password,mobile,role,state,email} = req.body
                let sql2 = `select * from userinfo where name='${name}'`
                connection.query(sql2, (err, results,files) => {
                    if(err) return next(err)
                    if(results.length>0) {
                        res.json({code: 1,message:'该用户已存在请勿重复添加'})
                    }else {
                        let sql3 = `insert into logininfo(username,password)  values('${name}','${password}')`
                        let sql4 = `insert into userinfo(name,email,mobile,role,state) values('${name}','${email}','${mobile}','${role}','${state}')`
                        connection.query(sql3, (err, result3, files) => {
                            if(err) return next(err)
                            connection.query(sql4, (err, result4, files) => {
                                if(err) return next(err)
                                res.status(200).json({code: 200, message: '添加用户信息成功'})
                            })
                        })
                    }
                })
            }else{
                res.json({code:0 ,message: '对不起你没有权限进行操作'})
            }
        })
    }else {
        res.json(result)
    }
})
//用户菜单列表
router.get('/menus',(req, res, next) => {
    const result = decode(req)
    if(result.code===200){
        let name = result.decoded.username
        let sql = `select * from userinfo where name='${name}'`
        connection.query(sql,(err,result,files)=>{
            if(err) return next(err)
            if(result.length>0) {
                res.status(200).json(constant.permission)
            }else{
                res.json({ code: 0,message:'对不起，你没有权限进行操作'})
            }
        })
    }else{
        res.json(result)
    }
        
})
//修改用户状态
router.get('/change',(req,res,next) => {
    const result = decode(req)
    if(result.code===200) {
        let name = result.decoded.username
        let sql1 = `select * from userinfo where name='${name}'`
        connection.query(sql1,(err,result,files)=>{
            if(err) return next(err)
            if(result.length>0) {
                let info = req.query
                let sql2 = `update userinfo set state='${info.state}' where name='${info.name}'`
                connection.query(sql2, (err, results,files) =>{
                    if(err) return next(err)
                    res.status(200).json({code:200,message:"修改用户状态成功"})
                })
            }else{
                res.json({code:0,message:'对不起你没有权限进行操作'})
            }
        })
    }else {
        res.json(result)
    }
})
//用户信息请求
router.get('/users',(req,res,next) => {
    const result = decode(req)
    if(result.code===200){
        let name = result.decoded.username
        let sql1 = `select * from userinfo where name='${name}'`
        connection.query(sql1,(err,result,files)=>{
            if(err) return next(err)
            if(result.length>0) {
                let query = req.query
                if(query.query ==='') {
                    let sql2 = `select * from userinfo`
                    connection.query(sql2, (err, results, files) => {
                        if(err) return next(err)
                        let count = results.length
                        results.forEach(element => {
                            if(element.state==='true'){
                                element.state = true
                            }else{
                                element.state = false
                            }
                        })
                        let start = (query.pagenum-1)*(query.pagesize)
                        let end = start + (+query.pagesize)
                        let users = results.slice(start, end)
                        let resobj = {
                            totalpage: count,
                            pagenum: query.pagenum,
                            users,
                            code: 200,
                            message: '获取成功'
                        }
                        res.status(200).json(resobj)
                    })
                }else {
                    //query条件不为空时
                    let sql3 = `select * from userinfo where name like '%${query.query}%'`
                    connection.query(sql3, (err, resultss, files) => {
                        if(err) return next(err)
                        let count = resultss.length
                        resultss.forEach(element => {
                            if(element.state==='true'){
                                element.state = true
                            }else{
                                element.state = false
                            }
                        })
                        let start = (query.pagenum-1)*(query.pagesize)
                        let end = start + (+query.pagesize)
                        let users = resultss.slice(start, end)
                        let resobj = {
                            totalpage: count,
                            pagenum: query.pagenum,
                            users,
                            code: 200,
                            message: '获取成功'
                        }
                        res.status(200).json(resobj)
                    })
                }
            }else{
                res.json({code:0,message:'对不起你没有权限进行操作'})
            }
        })
    }
    else{
        res.json(result)
    }
})
module.exports = router