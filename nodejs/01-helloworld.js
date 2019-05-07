/**
 * 实现返回一个 hello world 的 Node 服务器
 */

var http = require("http");

var app = http.createServer(function(req, res) {
    res.end("hello world\n");
});

app.listen(3000);