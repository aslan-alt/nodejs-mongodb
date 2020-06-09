const fs = require('fs');
const http = require('http');
const { MongoClient } = require('mongodb')
const url = "mongodb://admin:123456@localhost:27017"
const query = require('querystring')
const router = require('./express-router/index')
const ejs = require('ejs')

//配置路由
//增加获取数据

router.get('/', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            console.log(err)
            return
        }
        let db = client.db('game')
        db.collection('names').find({}).toArray((err, data) => {
            !err && console.log(data)
            client.close()
            ejs.renderFile('./views/index.ejs', { list: data }, (err, data) => {
                res.send(data)
            })
        })
    })
})
router.get('/register', (req, res) => {
    ejs.renderFile('./views/register.ejs', {}, (err, data) => {
        !err && res.send(data)
    })
})
//增加数据
router.post('/doRegister', (req, res) => {
    let data = query.parse(req.body)
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.log(err)
            return
        }
        client.db('game').collection('names').insertOne(data, (err, result) => {
            if (err) {
                console.log(err)
                return
            }
            console.log(result)
            client.close()
            res.send(result)
        })
    })
})

http.createServer(router).listen(8081);



console.log('Server running at http://127.0.0.1:8081/');

