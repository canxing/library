/**
 * 使用文件流实现简单的静态文件服务
 */
var http = require("http");
var fs = require("fs");

var app = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type" : "text/html; charset=UTF-8"});
    var page = fs.createReadStream("./03-response-static-service.html");
    page.pipe(res);
});
app.listen(3000);