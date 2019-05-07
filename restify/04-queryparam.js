/**
 * 从请求的 URL 中获取查询参数， http://localhost:3000/?abc=123&efd=456
 */

var restify = require("restify");
var querystring = require("querystring");

var server = restify.createServer();

//server.use(restify.plugins.queryParser());

server.get("/query", (req, res, next) => {
    //console.log(req.query);
    //console.log(querystring.parse(req.getUrl().query));
    console.log(req.getUrl());
    res.send("over");
});

server.listen(3000);
