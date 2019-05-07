var server = require("./server");
var requestHandler = require("./requestHandler");
var router = require("./router");

var handle = {};
handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["/upload"] = requestHandler.upload;
handle["/notFound"] = requestHandler.notFound;

server.start(router.route, handle);