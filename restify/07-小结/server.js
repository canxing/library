var restify = require("restify");
var fs = require("fs");

var server = restify.createServer();

server.use(restify.plugins.bodyParser({
    uploadDir : "/home/canxing/temp",
    keepExtensions: true,
}));
server.get("/start", restify.plugins.serveStatic({
    directory:"./view",
    default: "index.html",
    file: "index.html"
}))

server.post("/upload", (req, res, next) => {
    console.log("starting....");
    //console.log(req.files);
    console.log(typeof(req.body.upload));
    //console.log(req);
//    console.log(req.files.upload.path);
//    fs.createReadStream(req.files.upload.path).pipe(res);

//    var form = formidable.IncomingForm();
//    console.log("初始化完成");
//    form.parse(req);
//    console.log("解析完成");
//
//
//    form.parse(req, function(err, fields, files) {
//        res.writeHead(200, {'content-type': 'text/plain'});
//        console.log(fields);
//    });

//    form.on("file", (name, file) => {
//        console.log("name = " + name);
//        console.log(file);
//    });
//    form.on("end", () => {
//        res.send("over");
//    });
});

//server.post("/upload", (req ,res, next) => {
//    var form = formidable.IncomingForm();
//    form.parse(req);
//
//    form.uploadDir = "/home/canxing/temp";
//    form.keepExtensions = true;
//
//    form.on("file", (name, file) => {
//        console.log(file);
//        //res.writeHead(200, {"Content-Type" : "image/jpg;"});
//        //fs.createReadStream(file.path).pipe(res);
//    });
//});

server.listen(3000);