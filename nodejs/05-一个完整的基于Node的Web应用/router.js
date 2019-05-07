/**
 * 路由模块
 */
var url = require("url");

function route(handler, req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log("Request pathname is :" + pathname);
    if(pathname === '/favicon.ico') {
        res.end();
        return ;
    }
    if (typeof handler[pathname] === "function") {
        handler[pathname](req, res);
    } else {
        handler["/notFound"](req, res);
    }
}
exports.route = route;