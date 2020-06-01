const url = require('url')

function changeRes(res){
    res.send = (data) =>{
        res.writeHead(200,{'Content-Type':'text/html;charset="utf-8"'})
        res.end(data)
    }
}

let server = () => {
    let G = {}
    G._post = {}
    G._get = {}
    let app = function (req, res) {
        //扩展res的方法
        changeRes(res)
        //调用app 方法
        let pathName = url.parse(req.url).pathname
        console.log('--------')
        console.log(G)
        let method = req.method.toLowerCase()
        if(G['_'+method][pathName]){
            if (method === 'get') {   
                G._get[pathName](req, res)
            }else{
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
        
        else{
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
    return app
}

module.exports = server()

