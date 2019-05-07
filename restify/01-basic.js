/**
 * 最简单的 restify 构建的服务器
 */

var restify = require("restify");

var server = restify.createServer();

server.listen(8080);