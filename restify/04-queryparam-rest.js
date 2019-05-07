/**
 * 获取 REST 风格中的参数
 */

var restify = require("restify");

var server = restify.createServer();

var plugins = [
    restify.plugins.bodyParser({
        mapParams: true
    }),
    restify.plugins.queryParser({
        mapParams: true
    }),
    restify.plugins.jsonp(),
]

server.use(plugins);

server.post("/:year/:month/:day/:article", (req, res, next) => {
    console.log(req.params);
    console.log(req.params.year);
    console.log(req.params.month);
    console.log(req.params.day);
    console.log(req.params.article);
    res.send("over");
});

server.listen(3000);