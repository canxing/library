# linux 下安装 go 语言

[参考文章](https://golang.org/doc/install)

使用二进制文件安装 go 1.12 环境。

## 安装环境

debian 9

## 安装步骤

1. 下载 go 安装包

  [下载地址](https://golang.org/dl/)

  选择对应的安装包

2. 安装

  解压下载下来的文件，将文件夹放在喜欢的地方，一般放在 `/usr/local` 或者 `/opt` 文件夹下。

  修改 `~/.bashrc` 文件，添加 go 环境变量

  ```sh
  export PATH=${PATH}:/opt/go/bin
  ```

3. 配置 go

  除了 go 语言的环境变量，还需要配置 go 语言的工作区间

  [go 语言编写指南](https://golang.org/doc/code.html#Workspaces)

  在 `~/.bashrc` 文件中添加 GOPATH

  ```sh
  export GOPATH=/home/canxing/code/go/
  ```

## 参考文章

[Getting Started](https://golang.org/doc/install)

[How to Write Go Code](https://golang.org/doc/code.html)
