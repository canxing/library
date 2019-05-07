# restify 的使用

## 什么是 restify

restify 是 Node 的第三方包，是一个 web 应用开发框架，使用 `npm` 即可下载

```javascript
npm install restify
```

## 如何使用 restify

使用 Node 自带的功能实现一个 HTTP 服务器需要以下几步：

```javascript
var http = require("http");
var app = http.createServer(function(req, res){});
app.listen(8080);
```

使用 restify 实现一个 HTTP 服务器需要以下几步：

```javascript
var restify = require("restify");
var server = restify.createServer();
server.listen(8080);
```

当然上面的服务器不能响应任何请求，使用 curl 对服务器进行访问返回 `{"code":"ResourceNotFound","message":"/ does not exist"}`，使用浏览器访问直接返回无法访问此网站。

## restify 如何获取请求头信息

restify 的响应对象是 node 原生请求对象（http.ServerRequest）的扩展，因此可以通过原生 node 请求对象的 `headers` 属性获取请求头

## 请求如何响应

restify 处理响应和 Connect,Express 相似，使用中间件（不知道 restify 是不是这个叫法）来处理请求，可以将中间件挂载在指定的目录下。

### 如何判断请求的方式，GET，POST，DELETE 等

`req.method` 可以返回请求的方式

### 如何从 URL 中获取查询参数

方式一（推荐）：使用 queryParser 插件

```javascript
server.use(restify.plugins.queryParser());
console.log(req.query);
```

使用 queryParser 插件之后请求对象的 query 保存了查询参数的 JSON 对象

方式二：

`req.getUrl()` 方法返回 URL 的属性，其中 query 属性保存有查询参数，但是是字符串型形式不是 JSON 对象，将字符串形式转换为 JSON 对象可以使用 `querystring` 模块。

```javascript
var querystring = require("querystring");
console.log(querystring.parse(req.getUrl().query));
```

完整代码查看 [04-queryparam.js](./04-queryparam.js)

### 如何使用 REST 风格获取参数

获取 REST 风格参数首先要将路由格式写成 `:<name>` 的形式，然后通过 `req.param.[<name>]` 的形式访问

```javascript
server.get("/:year/:month/:day/:article", (req, res, next) => {
    console.log(req.params.year);
    console.log(req.params.month);
    console.log(req.params.day);
    console.log(req.params.article);
    res.send("over");
});
```

### 如何获取请求体中的数据

方式一：使用 bodyParser 插件

使用 bodyParser 插件之后 req 的 body 属性会保存请求信息，这个请求信息是以 JSON 对象的形式保存的，如果不想以 JSON 对象的形式保存，可以使用 bodyReader 插件

```javascript
server.use(restify.plugins.bodyParser());
console.log(req.body);
```

bodyParser 插件会把 `a=a&b=b` 转换为 JSON 对象，但是传递的本来就是 JSON 对象 `{a:a,b:b}` 那么取出的值是 `{{a:a,b:b}: ''}`，这种情况应该使用 `bodyReaer`

方式二：

使用 req 监听 `data` 和 `end` 事件，然后将数据在 `data` 监听器中缓存起来，在 `end` 监听器中处理

如何获取请求体中的数据请看 [05-request-body.js](05-request-body.js)

### 如何返回静态资源

方式一（推荐）：使用 serveStatic 插件

```javascript
server.get("/", restify.plugins.serveStatic({
    directory: './06-static-service',
    default:'index.html'
}));
```

方式二：
指定返回的数据格式是 `text/html`，使用文件流管道连接到输出流

```javascript
server.get('/', (req, res, next) => {
    res.writeHead(200, {
        "Content-Type" : "text/html; charset=UTF-8"
    })
    fs.createReadStream("./06-static-service/index.html").pipe(res); 
});
```
