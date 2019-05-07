/**
 * 用户请求
 */

var http = require("http");
var app = http.createServer(function(req, res){
    console.log(req.method);
    console.log(req.url);
    console.log(req.headers);
    console.log(req.httpVersion);
    res.end("over\n");
});
app.listen(3000);