const url = require('url')
const fs = require('fs')
const path = require('path')

function changeRes(res) {
    res.send = (data) => {
        res.writeHead(200, { 'Content-Type': 'text/html;charset="utf-8"' })
        res.end(data)
    }
}
//根据后缀名获取文件类型
function getFileMime(extname) {
    let data = fs.readFileSync('./data/mime.json')
    let mimeObj = JSON.parse(data.toString())

    return mimeObj[extname]
}
function staticInit(req, res, staticPath) {

    let pathName = url.parse(req.url).pathname//可以通过url模块parse方法拿到url 中的路径

    const extname = path.extname(pathName)//通过path 模块extname拿到后缀类型
    
    try {
        const data = fs.readFileSync('./' + staticPath + pathName).toString()
        
        if (data) {
            const contentType = getFileMime(extname)
            res.writeHead(200, { 'Content-Type': `${contentType},charset="utf-8"` });
            res.end(data);
        }
    } catch (error) {
        console.log(error)
    }
}

let server = () => {
    let G = {
        _post: {},
        _get: {},
        staticPath: 'static'
    }

    let app = function (req, res) {
        //扩展res的方法
        changeRes(res)
        //配置静态服务
        staticInit(req, res, G.staticPath)
        //调用app 方法
        let pathName = url.parse(req.url).pathname
        let method = req.method.toLowerCase()
        if (G['_' + method][pathName]) {
            if (method === 'get') {
                G._get[pathName](req, res)
            } else {
                let postData = ''
                req.on('data', (chunk) => {
                    postData += chunk
                })
                req.on('end', () => {
                    console.log(postData)
                    req.body = postData
                    G._post[pathName](req, res)
                    res.end(postData)
                })
            }
        }
        else {
            // post 获取的post数据 把它绑定到req
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('页面不存在');
        }
    }
    app.get = function (str, callback) {
        console.log(`传进来的是${str}`)
        //注册方法
        G._get[str] = callback
    }
    app.post = function (str, callback) {
        console.log(`传进来的是${str}`)
        G._post[str] = callback
    }
    app.staticPath = function (staticPath) {
        G.staticPath = staticPath
    }
    return app
}

module.exports = server()

