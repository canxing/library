/**
 * 定义了处理不同请求的函数
 */

function start() {
    console.log("Request handler 'start' was called.");
    function sleep(second) {
        var startTime = new Date().getTime();
        while(new Date() < startTime + second) ;
    }
    sleep(10000);
    return "hello world";
}
function upload() {
    console.log("Request handler 'upload' was called.");
    return "hello upload";
}
exports.start = start;
exports.upload = upload;