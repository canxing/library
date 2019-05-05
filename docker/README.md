# Docker基础

本文参考自 `<<Docker--从入门到实践>>`，该书[github 地址](https://github.com/yeasy/docker_practice)，[国内镜像](https://gitee.com/docker_practice/docker_practice)

+ [基本概念](#基本概念)
+ [镜像](#镜像)
  + [获取镜像](#获取镜像)
  + [查看本地镜像](#查看本地镜像)
  + [运行镜像](#运行镜像)
  + [停止容器](#停止容器)
  + [删除本地镜像](#删除本地镜像)
  + [定制镜像](#定制镜像)
  + [Dockerfile 指令](#Dockerfile指令)
  + [导入导出镜像](#导入导出镜像)
+ [容器](#容器)
  + [启动容器](#启动容器)
  + [查看容器信息](#查看容器信息)
  + [终止容器](#终止容器)
  + [进入容器](#进入容器)
  + [删除容器](#删除容器)
+ [数据管理](#数据管理)
  + [数据卷](#数据卷)
  + [挂载主机目录](#挂载主机目录)

## 基本概念

Docker 包含三个基本概念: 镜像，容器，仓库。镜像是模板，容器是根据镜像的定义生成的，仓库是存放镜像的地方。镜像在 VirtualBox 的概念相当于一个 OVA 文件，VirtualBox 可以导入这个 OVA 文件创建一个虚拟机，这个虚拟机就相当于容器的概念（并不是完全相似，容器在退出时会删除所有容器中的数据，每次启动容器就好像第一次启动，通过一些方法可以保存容器中的数据），存放 OVA 文件的地方就相当于一个仓库。

## 镜像

Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序，库，资源，配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷，环境变量，用户等）。镜像不包含任何动态数据，其内容在构建之后也不会改变。

### 获取镜像

从 Docker 镜像仓库获取镜像的命令是 `docker pull`。命令格式为:

```sh
docker pull [选项] [Docker Registry 地址[:端口号] /][用户名/]仓库名[:标签]
```

其中大部分参数可以省略，一个最简单的 `docker pull` 命令如下:

```sh
docker pull hello-world
```

如果没有指定镜像的地址，那么默认地址为 Docker Hub 的地址，如果没有指定标签，那么默认标签为 latest。执行上面命令，会默认从 Docker Hub 拉取 hello-world:latest 镜像。

### 查看本地镜像

通过 `docker imager ls` 命令可以查看本地安装的镜像

在本地运行上述命令得到的结果如下：

REPOSITORY    |      TAG |                 IMAGE ID |            CREATED |             SIZE
---- | ---- | --- | --- | --- |
hello-world |         latest |              4ab4c602aa5e |        7 weeks ago |         1.84kB |

上述命令会列出本地镜像的所有信息，包括镜像名称，镜像标签，镜像 ID，镜像创建时间和镜像大小。

### 运行镜像

获取到一个镜像之后，就可以利用这个镜像为基础启动一个容器。

使用 `docker run` 命令可以运行一个容器。

```sh
docker run hello-world
```

在执行 `docker run` 命令时，会首先检查本地镜像，如果本地没有指定的镜像，会从指定的仓库拉取指定镜像。

### 停止容器

启动一个容器之后可以通过 `docker container ls` 命令来查看容器的运行状态。

如果想要终止容器，使用 `docker container stop` 命令终止。对于已经停止的容器可以使用 `docker container start` 来重新启动。此外 `docker container restart` 命令会将一个正在运行的容器终止，然后重新启动。

### 删除本地镜像

删除本地镜像使用 `docker image rm `命令，其格式为：

```sh
docker image rm [选项] <镜像1> [<镜像2> ...]
```

其中镜像可以是镜像短 ID，镜像长 ID，镜像名或者镜像摘要

### 定制镜像

Docker Hub 提供了很多镜像可以直接使用，对于在 Docker Hub 或者其他 Docker 仓库没有找到合适的镜像时，可以依赖某个镜像来创建符合自己需要的镜像。

这里使用 Dockerfile 来定制镜像。

这里定制的镜像以 Ngxin 镜像来基础进行创建，修改的内容为改变 Nginx 的 index.html 页面。首先创建 `mynginx` 目录，在 `mynginx` 目录中创建 `Dockerfile` 文件，Dockerfile 文件内容如下:

```sh
FROM nginx
RUN echo "<h1>Hello, Docker!</h1>" > /usr/share/nginx/html/index.html
```

接着使用 `docker build -t nginx:v3 .` 命令来构建这个镜像，执行该命令输出如下：

```sh
Sending build context to Docker daemon  2.048kB
Step 1/2 : FROM nginx
 ---> dbfc48660aeb
Step 2/2 : RUN echo "<h1>Hello, Docker!</h1>" > /usr/share/nginx/html/index.html
 ---> Running in e0233dda1b82
Removing intermediate container e0233dda1b82
 ---> 135ca948fc71
Successfully built 135ca948fc71
Successfully tagged nginx:v3
```

接着使用 `docker image ls` 命令来查看本地镜像，可以看见本地镜像中已经创建好了 `nginx:v3`

```
[canxing@debian docker] $ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               v3                  135ca948fc71        40 seconds ago      109MB
nginx               v2                  03fa889452ca        About an hour ago   109MB
nginx               latest              dbfc48660aeb        2 weeks ago         109MB
hello-world         latest              4ab4c602aa5e        7 weeks ago         1.84kB
```

接着使用 `docker run --name web3 -d -p 80:80 nginx:v3` 命令来启动容器，在浏览器中输入 `localhost` 即可看见 Nginx 的 index.html 页面已经改变。

定制一个 Docker 镜像的关键在于 Dockerfile 文件，对于 Dockerfile 文件中的指令信息请看下面。

### Dockerfile指令

指令 | 作用 | 语法 | 备注
--- | --- | ---- | ---
FROM | 声明制作的镜像是以哪个镜像为基础的 | `FROM <仓库>[:<标签>]` | 每个 Dockerfile 文件必须有一个 FROM 指令，并且该指令必须是第一条指令。如果只声明了仓库名没有声明标签，那么标签默认为 latest
RUN | 用来执行命令行的命令 | `RUN <命令>` 或者 `RUN ["可执行文件", "参数1", "参数2"]` | 
COPY | 选择本地文件复制到 Docker 镜像 | `COPY <源路径>... <目标路径>` 或者 `COPY ["<源路径1>", ..., "<目标路径>"]` | 这里的源路径不是指本地路径，而是 Docker 构建的上下文路径
ADD | 比 COPY 更高级的复制指令 | 同 COPY | 可以使用 RUN 或者 COPY 代替
CMD | 容器启动命令 | `CMD <命令>` 或者 `CMD ["可执行文件", "参数1", "参数2", ...]` | 在容器启动时执行的命令，和 RUN 不同，RUN 是在镜像构建过程执行的命令。CMD 命令在容器启动时可以输入新命令替代
ENTRYPOINT | 定义容器的入口点，指定容器启动时执行的命令 | `ENTRYPOINT <命令>` 或者 `ENTRYPOINT ["可执行文件", "参数1", "参数2" ...]` | 和 CMD 不同，定义了 ENTRYPOINT 指令后，CMD 指令接受的都是参数，并且都会传递给 ENTRYPOINT 作为参数执行
ENV | 设置环境变量 | `ENV <key> <value>` 或者 `ENV <key1>=<value1> <key2>=<value2> ...` | 定义好环境变量后，在 ADD, COPY, ENV, EXPOSE, LABEL, USER, WORKDIR, VOLUME, STOPSIGNAL, ONBUILD 指令中都可以展开
ARG | 构建参数 | `ARG <参数名>[=<默认值>]` | 和 ENV 效果相同，设置环境变量，但是 ARG 设置的环境变量在容器启动时不存在
VOLUME | 设置卷 | `VOLUME <路径>` 或者 `VOLUME ["<路径1>, <路径2> ..."]` |
EXPOSE | 声明运行时容器提供服务的端口 | `EXPOSE <端口1> [<端口2> ...]` | EXPOSE 只是声明容器打算使用的端口，并不会绑定宿主端口
WORKDIR | 指定工作目录，以后各层的当前目录就被改为指定的目录，如果命令不存在，WORKDIR 就会创建 | `WORKDIR <工作目录路径>`
USER | 指定用户 | `USER <用户名>` | 保证用户名存在
HEALTHCHECK | 告诉 Docker 应该如何进行判断容器的状态是否正常 | `HEALTHCHECK [选项] CMD <命令>` | 如果基础镜像有健康检查可以使用 `HEALTHCHECK NONE` 屏蔽。HEALTHCHECK 是 Docker 1.12 引入的新指令
ONBUILD | 当以当前镜像为基础，构建下一层镜像时才会被执行 | `ONBUILD <其他指令>` |

### 导入导出镜像

Docker 镜像可以本地导出再分享。导出命令如下

```sh
docker image save -o <source> <仓库>:<标签>
```

比如导出一个 ubuntu:base 镜像使用

```sh
docker image save -o ~/ubuntu_base.tar ubuntu:base
```

导入一个镜像使用 `docker image load`

```sh
docker image load -i ~/ubuntu_base.tar
```

## 容器

镜像是静态的，容器是动态的。容器是基于镜像创建的，每个容器包含两层，底层是基于镜像的基础层，顶层是当前容器的容器存储层，容器运行于自己独立的`命名空间`，容器存储层的生命周期和容器的一样，当容器消亡时，容器存储层也随之消亡。下次启动的容器又会创建新的空间和容器存储层，因此不应该向容器存储层写入任何数据，存储数据应该使用数据卷或者宿主目录。

### 启动容器

启动一个容器使用 `docker run` 命令，docker run 命令可以带很多参数，有几个常用的参数

+ -i 打开容器的标准输入
+ -t 让 Docker 分配一个伪终端到容器的标准输入上
+ -d 保持容器后台运行
+ -p 指定宿主和容器之间的端口映射
+ --name 指定容器运行的名称

也可以使用 `docker container start` 命令启动一个已经终止了的容器。

### 查看容器信息

使用 `docker container ls` 可以查看运行的容器信息，`docker container ls -a` 可以查看所有容器信息，包括终止的。

### 终止容器

终止容器使用 `docker container stop` 命令。

### 进入容器

如果在启动容器时使用了 `-d` 参数，那么容器会进入后台，在某些时候需要进入后台容器时，可以使用 `docker attach` 或者 `docker exec` 命令。

使用 `docker attach` 进入容器后退出会导致容器停止，而 `docker exec` 不会。建议使用 `docker exec`，停止容器使用 `docker container stop`。

`docker exec` 需要知道容器的 id，可以通过 `docker container ls` 命令查看，然后通过 `docker exec -i -t <id>` 命令进入容器。

更多参数可以通过 `docker exec --help` 查看

### 删除容器

删除容器使用 `docker container rm` 命令。同样需要知道容器的 id，如果需要删除正在运行的容器，需要加参数 `-f`

## 数据管理

容器运行与独立的空间，一个容器消亡时其容器存储层存储的数据也会丢失，对于容器中的数据管理只要有两种方式：数据卷和挂载主机目录

### 数据卷

数据卷是一个可供一个或多个容器使用的特殊目录，数据卷可以在容器之间共享和重用，对数据卷的修改会立马生效，对数据卷的更新不影响镜像，数据卷默认一直存在，即使容器被删除。

数据卷是一个特殊的目录，他的特殊之处在于这个目录完全由 Docker 进行管理。

创建一个数据卷

```sh
$ docker volume create my_vol
```

查看数据卷

```sh
$ docker volume ls
DRIVER              VOLUME NAME
local               my_vol
```

查看数据卷详细信息

```sh
$ docker volume inspect my_vol
[
    {
        "CreatedAt": "2018-10-31T17:21:01+08:00",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my_vol/_data",
        "Name": "my_vol",
        "Options": {},
        "Scope": "local"
    }
]
```

查看 `docker volume create --hellp` 之后发现数据卷创建的位置似乎不能改变。

删除数据卷

```sh
$ docker volume rm my_vol
my_vol
$ docker volume ls
DRIVER              VOLUME NAME
```

挂载数据卷

```sh
$ docker volume create my-vol
$ docker run -it --mount source=my-vol,target=/opt ubuntu:base
```

可以在容器的 `/opt` 目录下添加文件，然后在数据卷本地位置上查看。

### 挂载主机目录

Docker 允许挂载一个普通的主机目录到容器，因为这个主机目录不归 Docker 管理，因此主机目录的位置可以随意放置，但是这也会在某些情况导致该目录读取存在权限拒绝的情况。

在用户目录下创建一个目录，然后挂在到容器中。

```sh
$ make vol
$ docker run -it --mount type=bind,source=/root/vol,target=/opt ubuntu:base
```

> 挂在主机目录时，需要使用绝对路径，因此需要将 /root/vol 改为自己主机上的绝对路径
