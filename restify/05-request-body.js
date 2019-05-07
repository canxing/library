/**
 * 获取请求体中的数据
 */

var restify = require("restify");

var server = restify.createServer();
server.use(restify.plugins.bodyParser());
//server.use(restify.plugins.bodyReader());
//server.use(restify.plugins.jsonBodyParser());

server.post("/", (req, res, next) => {
    console.log(req.body);
    res.send(req.body);

//    text = "";
//    req.on("data", (chunk) => {
//        text += chunk;
//    });
//    req.on("end", () => {
//        res.send(text);
//    });
});

server.listen(3000);