/**
 * 使用 restify 实现一个返回 hello 的服务器。
 */

var restify = require("restify");

var server = restify.createServer();

server.get("/hello", (req, res, next) => {
    res.header("Content-Type", "text/html");
    res.send("hello world\n");
});;

server.listen(8080);