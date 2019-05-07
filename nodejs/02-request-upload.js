/**
 * 文件上传
 */

var http = require("http");
var formidable = require("formidable");
var util = require("util");

var app = http.createServer(function(req, res){
    if (req.method.toUpperCase() == 'GET') {
        //返回文件上传页面
        var page = "<html><head><meta charset='utf-8' /><title>文件上传</title></head><body>"
        + "<form method='post' action='/' enctype='multipart/form-data' >"
        + "<input type='text' name='username' /><br>"
        + "<input type='file' name='upload' multiple='multiple' /><br>"
        + "<input type='submit' value='upload' />"
        + "</form>"
        + "</body></html>";

        res.writeHead(200, {
            "Content-Type" : "text/html",
            "Content-Length" : Buffer.byteLength(page)
        })
        res.end(page);
    } else {
        var form = formidable.IncomingForm();
        form.parse(req);
        //设置解析编码
        form.encoding = 'utf-8';
        //设置上传目录
        form.uploadDir = "/home/canxing/temp";
        //是否保持扩展名
        form.keepExtensions = true;

//        form.parse(req, function(err, fields, files) {
//            res.writeHead(200, {'content-type': 'text/plain'});
//            res.end(util.inspect({fields: fields, files: files}));
//        });

        form.on("field", function(field, value){
            console.log(field);
            console.log(value);
        });
        form.on("file", function(name, file){
            console.log(name);
            console.log(file);
        });
        form.on("end", function(){
            res.writeHead(200, {
                "Conent-Type" : "text/plain"
            });
            res.end("over", "utf-8");
        });
    }

});

app.listen(3000);