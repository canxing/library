var http = require("http");

function start(route, handle) {
    function onRequest(req, res) {
        route(handle, req, res);
    }
    var app = http.createServer(onRequest);
    app.listen(3000);
}

exports.start = start;