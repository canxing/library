
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
server.start(router.route, handle);
