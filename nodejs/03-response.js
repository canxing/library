/**
 * 简单的响应
 */

var http = require("http");

var app = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type" : "text/plain; charset=UTF-8"
    });
    res.end("你好，世界\n");
});
app.listen(3000);