# docker 私有镜像仓库

docker 官方提供了 `docker-registry` 镜像用来构建私有镜像仓库。

```sh
docker run --name docker-registry -d -p 5000:5000 --restart=always registry
```

该命令会使用在本地创建一个 docker 镜像仓库，该仓库的的端口是 5000。

默认情况下仓库会在容器的 `/var/lib/registry` 目录下。使用 `-v` 参数可以将容器仓库放在本地指定路径。

```sh
docker run --name docker-registry -v /opt/docker/data/registry:/var/lib/registry -d -p 5000:5000 --restart=always registry
```
