/**
 * 定义了处理不同请求的函数
 */

function start(req, res) {
    console.log("Request handler 'start' was called.");
    res.writeHead(200, {"Content-Type" : "text/plain; charset=UTF-8"});
    res.end("hello world\n");
}
function upload(req, res) {
    console.log("Request handler 'upload' was called.");
    res.writeHead(200, {"Content-Type" : "text/plain"});
    res.end("upload\n");
}
exports.start = start;
exports.upload = upload;