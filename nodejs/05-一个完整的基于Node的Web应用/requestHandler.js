var fs = require("fs");
var formidable = require("formidable");

function start(req, res) {
    var readStream = fs.createReadStream("./view/index.html");
    readStream.pipe(res);
}
function upload(req, res) {
    console.log("upload");
    var form = formidable.IncomingForm();
    form.parse(req);

    form.on("file", function(name, file){
        res.writeHead(200, {
            "Content-Type" : "image/png",
        });
        fs.createReadStream(file.path).pipe(res);
    });
    //res.end("upload over");
}
function notFound(req, res) {
    console.log("404 Not found");
    res.end("404 Not found");
}

exports.start = start;
exports.upload = upload;
exports.notFound = notFound;