const fs = require('fs');
// const path =require ('path')
const http = require('http');

const router = require('./express-router/index')
const ejs = require('ejs')
//配置路由
router.get('/login', (req, res) => {
    ejs.renderFile('./views/login.ejs',{}, (err, data) => {
        res.send(data)
    })
})
router.get('/', (req, res) => {
    res.send('首页')
})
router.post('/doLogin', (req, res) => {
    console.log(decodeURI(req.body))
    res.send(req.body)
})
http.createServer(router).listen(8081);



console.log('Server running at http://127.0.0.1:8081/');

