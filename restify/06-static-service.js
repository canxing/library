/**
 * 返回静态资源
 */

var restify = require("restify");
var fs = require("fs");

var server = restify.createServer();

//server.get('/', (req, res, next) => {
//    res.writeHead(200, {
//        "Content-Type" : "text/html; charset=UTF-8"
//    })
//    fs.createReadStream("./06-static-service/index.html").pipe(res); 
//});

server.get("/", restify.plugins.serveStatic({
    directory: './06-static-service',
    default:'index.html'
}));

server.listen(3000);