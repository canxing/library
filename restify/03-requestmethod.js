/**
 * 如何判断请求方式
 */

var restify = require("restify");

var server = restify.createServer();

server.use((req, res, next) => {
    console.log(req.method);
    return next();
});
server.get('/', (req, res, next) => {
    res.send("get");
});

server.post("/", (req, res, next) => {
    res.send("post");
});

server.listen(3000);