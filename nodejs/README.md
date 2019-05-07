
# Nodejs

> 跟随 《Node 入门》一书，完成整本书的练习和总结，这里是总结部分，会附有相应的代码链接。

## 1. 一个完整的最简的 "hello world" 服务器

```javascript
var http = require("http");
var app = http.createServer(function(req, res) {
    res.end("hello world\n");
});
app.listen(3000);
```

一个最简的 Node 服务器必须的三步是：

1. 请求 Node 自带的 HTTP 模块，并将请求的结果用一个变量来接收，这里假设这个变量是 http
2. 使用 `var app = http.createServer(function(req, res){})` 来创建一个 Node 服务器对象，对于 `createServer()` 方法可以传入一个函数对象，该函数有两个参数：req（http.ServerRequest) 和 res（http.ServerResponse) 分别表示 Http 的请求和 Http 的响应。
3. 使用 `app.listen(port)` 监听一个端口号

第二步 `http.createServer(function(req, res){})` 之后为什么就创建了一个服务器，并且每次请求都会执行里面的代码呢？

这涉及到 Node 的事件触发器。事件触发器可以监听不同的事件，不同的事件可以触发不同的结果。每个事件对应不同的监听器，当事件被触发时，会调用响应的监听器。

每一个事件触发器都是 events.EventEmitter 的实例。当注册事件时，会触发 `newListener` 事件。如果发生错误，`error` 事件将会被触发，如果没有相应的监听函数处理这个事件，node 会结束应用程序并显示异常堆栈。

下面是事件触发器的一些方法：

```javascript
emitter.on(event, listener); //在事件触发器的事件监听组尾部添加一个新的监听器。
emitter.removeListenter(event, listener); //从一个事件触发器的事件监听器组中删除一个监听器。
emitter.removeAllListenter(event); //删除指定事件触发器中的所有事件监听器组。
emitter.listeners(event); //返回指定事件触发器中的所有事件监听器组。
```

回过头来看 `http.createServer(function(req, res){})`，该方法的 `function(req, res){}` 是一个监听器，这个方法自动的添加到 `http.server` 的 `request` 事件上，`request` 事件是当服务器收到请求之后触发。因此注册到 `server` 的 `request` 事件的方法在收到请求都会被执行。

关于 `http.server` 的相关介绍基本都完成了，剩下的方法是关于服务器证书(setSecure)，监听端口号(listen)，设置最大链接数(maxConnections)，返回当前链接数(connections)，以及其他一些乱七八糟的监听事件的设置。

## 2. 处理请求

和请求有关的参数都被 Node 封装在 `http.ServerRequest` 对象中，该对象有 Http Server 创建，作为 `request` 事件监听器的第一个参数，通过该对象可以获取用户请求的方式 (POST, GET)，用户请求的 URL，用户请求头，用户请求的协议。

`request.method` 属性可以返回用户请求的方式，通过和 `GET` `POST` 进行比较可以判断是 `GET` 请求还是 `POST` 请求。

`request.url` 属性可以返回用户请求的 URL。

`request.headers` 属性返回用户的请求头。

`request.httpVersion` 属性返回用户的 HTTP 请求版本协议。

对于这四个属性的输出可以通过 [02-request.js](./02-request.js) 程序运行得到。

其中 `request.headers` 属性可以通过`名`或者是`键`访问`值`

对于请求的 URL，Node 提供了内置模块 `url` 帮助处理，可以将 url 转换为`名/值对`的形式

```javascript
> var url = require("url");
> url.parse("http://localhost:3000/tom/jerry?username=canxing&password=abc")
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'localhost:3000',
  port: '3000',
  hostname: 'localhost',
  hash: null,
  search: '?username=canxing&password=abc',
  query: 'username=canxing&password=abc',
  pathname: '/tom/jerry',
  path: '/tom/jerry?username=canxing&password=abc',
  href:
   'http://localhost:3000/tom/jerry?username=canxing&password=abc' }

```

上面是通过 `url` 模块处理请求的 URL 之后的结果，对于 结果中的 `query` 值还可以进一步处理，通过为 `url.parse(url)` 添加第二个属性 true，可以对解析 URL 的查询条件，`url.parse(url, true)`，具体自己尝试

使用 `url.parse(url, true)` 其实使用了内置模块 `querystring` 来解析查询条件，下面是 `querystring` 解析查询参数的示例

```javascript
> require("querystring").parse("username=canxing&passwrod=abc");
{ username: 'canxing', passwrod: 'abc' }
```

## 2.1. POST 请求

以上的属性方法是用于所有的请求方式，对于 POST 请求还有一些额外的处理。POST 请求可能通过请求体传递数据，要处理 POST 请求的请求体要使用 `http.ServerRequest` 的 `data` 事件监听器和 `end` 事件监听器。

`data` 事件监听器在有数据传输时触发。

`end` 事件监听器在数据传输结束时触发。

关于这两个事件监听器的使用可以查看 [02-request-post.js](./02-request-post.js)，通过终端命令 `curl -d "发发动反击" http://localhost:3000/` 即可访问（需要先安装 `curl`）

传输的数据有可能存在乱码的问题，可以通过 `request.setBodyEncoding()` 方法设置消息的编码。

```javascript
request.setBodyEncoding('utf-8');
```

`http.ServerRequest` 还有其他的事件监听器，比如 `error` 错误时触发监听器，`close` 链接关闭时监听器

对于处理普通的文本数据，上述操作已经够用了，但是对于文件处理还不够。Node 第三方库提供了 `formidable` 模块来帮助处理 POST 请求，注意这里是 POST 请求，不仅仅是文件上传。

`formidable` 可以使用 `npm` 进行安装

```Node.js
npm install formidable
```

导入 `fromidable` 模块

```javascript
var formidable = require("formidable");
```

使用 formidable 来解析 POST 请求上传的数据，首先获取 `Formidable.IncomingForm` 对象。

```javascript
var form = formidable.IncomingForm();
```

`formidable.IncomingForm` 是一个事件触发器，可以注册 `progress` 事件，`field` 事件，`fileBegin` 事件，`file` 事件，`error` 事件，`aborted` 事件，`end` 事件。这些事件的详细介绍请看 [formidable](https://github.com/felixge/node-formidable)。这里只介绍`field` 事件，`file` 事件和`end` 事件。

`field` 事件用于接收表单中的文本域，该监听器接收两个参数 `name` 表示表单中文本域的 name 的属性值，value 表示 value 的属性值。每当有一个 `name/value` 对上传时就会触发一次 `field` 事件。

`file` 事件用于接收表单中的二进制文件，该监听器接收两个参数 name 表示表单中上传文件的 name 的属性值，`file` 表示接收的文本对象，是一个 `Formidable.File` 的实例。

`end` 事件在数据传输完成时响应，只调用一次，之后就不会有数据上传。

`field`,`file`,`edn` 的简单使用请看 [02-request-upload.js](./02-request-upload.js)，关于 `formidable` 的详细说明请看 [formidable](https://github.com/felixge/node-formidable)

## 3. 响应

响应作为 HTTP 服务器的 `request` 事件的第二个参数，由服务器创建。是一个可写流，为 `http.ServerResponse` 和 事件触发器的实例

该对象最主要的方法有三个 `writeHead`,`write` 和 `end`，`writeHead` 可以为返回添加信息，可以是状态码，内容类型，内容长度等。`write` 用于想响应中写入数据，但是不会关闭连接，`end` 用于向响应中写入数据并关闭连接，每次响应结束都是以 `end` 方法为结束标志。

[03-response.js](./03-response.js) 是一个返回 “你好，世界” 的服务器，使用了 `res.writeHead` 为返回设置返回类型以及返回的字符集编码，如果没有设置字符集编码，有可能出现字符乱码的问题。

`http.ServerResponse` 是一个可写流，流（Streams）是一个抽象接口，所有的 Streams 也是 EventEmitter 的实例。

[使用文件流实现静态文件服务示例](./03-response-static-service.js)

## 4. 代码组织

[04-代码组织-1](./04-代码组织-1/index.js) 是一个简单的模块化组织方式，server.js 中定义服务器，在 index.js 导入 server.js 然后启动服务器

[04-代码组织-2](./04-代码组织-2/index.js) 是一个带有路由和请求处理的服务器，router.js 中定义了路由方式，requestHandlers.js 中定义了各个请求的处理过程。这个示例代码是一种错误的方式。

使用 `http://localhost:3000/start` 访问服务器，紧接着使用 `http://localhost:3000/upload` 访问，不仅 `start` 访问阻塞，`upload` 的访问也会阻塞。

Node 的服务器是基于回调的方式实现的，示例二中的代码是其他编程语言常用的组织方式，但是在 Node 中，返回路由器结果的响应需要时间，因此阻塞了服务器的处理，导致后面的请求也会延迟响应。（这里没说明白）

[04-代码组织-3](./04-代码组织-3/index.js) 是目前最优的解决方式，也是使用回调机制，对于有延迟的操作，直接传入 `http.ServerRequest` 对象和 `http.ServerResponse` 对象，等待操作完成后有调用函数返回结果。

## 5. 一个完整的基于Node的Web应用

要求：

    1.  用户可以通过浏览器使用
    2. 当用户请求 `http://localhost:300/start` 的时候可以看见一个欢迎页面，页面上有一个文件上传的表单。
    3. 用户可以选择一个图片并提交，随后文件被上传到 `http://localhost:3000/upload`，该页面完成上传后会把图片显示在页面上。

这个完整的应用是基于 4.代码组织的方式构成的，详情查看 [05-一个完整的基于Node的web应用](./05-一个完整的基于Node的web应用/index.js)

## 附1 流

官方文档说明:

> 流（stream）是一种在 Node.js 中处理流式数据的抽象接口。 stream 模块提供了一些基础的 API，用于构建实现了流接口的对象。
> Node.js 提供了多种流对象。 例如，发送到 HTTP 服务器的请求和 process.stdout 都是流的实例。
> 流可以是可读的、可写的、或是可读写的。 所有的流都是 EventEmitter 的实例。

在 `03-response-static-service.js` 中使用了文件读取流和服务器输出流，两个流之间使用了 `pipe` 方法也就是管道就行连接，将一个只读流连接到可写流，由可写流输出。

管道的概念就像 Linux 命令 `ls -a | grep README.md` 有一个读流过渡到写流。

## 附2 文件操作

Node 中的文件操作依赖于 `fs` 模块，`fs` 模块有一大堆函数和几个重要的类，包括 `fs.FSWatcher`,`fs.ReadStream`,`fs.Stats`,`fs.WriteStream` 类，分别表示文件监听，文件只读流，文件状态类，文件可写流。

`fs` 的一大堆函数中，以 `Sync` 结尾的表示同步版本，没有 `Sync` 的为异步版本（大部分是这样，详细请查看 API）

其中打开文件的有以下几个函数：

函数 | 作用
---- | ----
fs.createReadStream | 打开一个文件只读流
fs.createWriteStream | 打开一个文件可写流
fs.open | 异步方式打开，可以是文件或者链接
fs.openSync | 同步方式打开，可以是文件或者链接
fs.readFile | 同步方式打开文件
fs.readFileSync | 同步方式开发文件

除了以上的函数，还有函数做用于目录。

在打开一个文件时，还应该检测文件状态，包括，打开路径是否存在，是否是文件，是否有权限

检测文件路径是否存在使用 `fs.existsSync` 函数检测，存在返回 true，不存在返回 false

对于是否是文件以及是否有权限访问，需要使用 `fs.Stats` 类。

`fs.Stats` 对象可以通过 `fs.stat` 函数，`fa.statSync` 函数得到，前一个是异步的，后一个是同步的，同步函数返回 `fs.Stats` 实例。

建议使用 `fs.stat` 函数，该函数接收一个回调函数，回调函数的第一个参数在文件不存在时是一个异常，通过这个检测也可以判断文件路径是否存在，第二个参数是 `fs.Stat` 实例，调用该实例的 `isFile` 方法可以判断这个路径是否是文件。

## 附3 npm 入门 （Linux 下的使用）

查看安装 Node 路径 `which node`，查看 npm 安装路径 `which npm`，使用不同的方式安装 Node，安装的路径也不一样。下面是我的安装路径：

```bash
canxing@canxing-debian:~$ which node
/home/canxing/.nvm/versions/node/v10.6.0/bin/node
canxing@canxing-debian:~$ which npm
/home/canxing/.nvm/versions/node/v10.6.0/bin/npm
```

我使用的是 `nvm` 版本管理工具安装，因此 npm 是在 node 的安装文件夹下面，不同的 node 版本有不同的 npm 管理，下面是 node 8.11 的查看

```bash
canxing@canxing-debian:~$ which node
/home/canxing/.nvm/versions/node/v8.11.3/bin/node
canxing@canxing-debian:~$ which npm
/home/canxing/.nvm/versions/node/v8.11.3/bin/npm
```

再次说明，使用不同的方式安装 Node，安装位置不一样

### 查看 npm 安装的全局位置

使用 npm 安装的全局模块会保存在 `{prefix}/lib/node_modules/` 文件夹中。

`{prefix}` 使用不同的方式表示的路径不同，但是查看方式都是相同的，使用 `npm config get prefix` 即可返回 `{prefix}` 对应的路径。

可以通过修改 `prefix` 来改变全局模块的安装位置，但是没必要修改。

### 安装全局模块

安装全局模块使用如下命令

```bash
npm install <node_module> -g
```

使用如下命令查看以安装的全局模块

```bash
npm list --global
```

可以加上 `--depth=0` 简化输出

```bash
npm list -g --depth=0
```

### package.json

`package.json` 是 Node 的包管理文件，依靠这个文件可以快速的找到项目的依赖项。`npm` 相对于 `Node` 就当于 `maven` 和 `Java` 的关系，`package.json` 对于 `npm` 就和 `pom.xml` 和 `maven` 的关系，`package.json` 就是用来记录项目需要哪些依赖的文件。通过这个文件可以让别人轻松的布置好开发环境，也可以轻松的使用别人的模块。

`package.json` 有很多配置信息，在项目文件下使用命令 `npm init` 可以快速创建一个 `package.json` 文件。

> 虽然没有 `package.son` 也可以使用 `npm install <node_module>` 安装本地模块，但是先创建好 `package.json` 再安装模块要方便一点

创建好 `package.json` 之后就可以使用 `npm install <node_module> --save` 安装本地模块，并把安装的本地模块依赖添加到 `package.json` 文件中的 `dependencies` 的值中，`dependencies` 表示项目运行需要的依赖模块，可以有多个值。和 `devDependencies` 不同，`devDependencies` 是用于测试开发环境中的依赖，这个依赖在实际运行时是不需要的，使用 `npm install <node_module> --save-dev` 可以将安装的依赖添加到 `devDependencies` 属性中。
