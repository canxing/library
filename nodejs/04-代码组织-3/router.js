
function route(pathname, handle, req, res) {
    if (typeof handle[pathname] === "function") {
        handle[pathname](req, res);
    } else {
        res.writeHead(200, {"Content-Type" : "text/plain; charset=UTF-8"});
        res.end("请求路径无效\n")
    }
}

exports.route = route;