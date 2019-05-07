/**
 * POST 请求
 */

var http = require("http");

var app = http.createServer(function(req, res){
    var msg = "";
    req.on("data", function(chunk) {
        msg += chunk;
    });
    req.on("end", function(){
        res.end(msg);
    });
});

app.listen(3000);