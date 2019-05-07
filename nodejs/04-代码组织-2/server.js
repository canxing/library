
var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(req, res) {
        var pathname = url.parse(req.url).pathname;
        console.log("Request for " + pathname + " received.");

        var content = route(pathname, handle);
        res.writeHead(200, {
            "Content-Type" : "html/plain",
            "Content-Length" : Buffer.byteLength(content)
        });
        res.end(content);
    }
    http.createServer(onRequest).listen(3000);
    console.log("Server hash started");
}

exports.start = start;