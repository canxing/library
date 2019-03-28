# 安装 istio

安装的 istio 版本为 1.1.0

## 安装环境

操作系统: Ubuntu 16.04
kubernetes: 1.11
docker: 17.03.2-c3
CPU: 4 核
内存: 8 GB

> 官方推荐的环境为 4 核 8 线程。以实际情况来看，istio 会进行大量的网络请求，机器性能越高越好

## 安装步骤

1. 下载安装包

    安装包可以从 github 上下载，也可以通过下面命令下载

    ```sh
    curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.1.1 sh -
    ```

    这个安装包不仅包含安装 istio 的编排文件，也包含一些官方示例

2. 安装 istio 命令行工具

    istio 命令行工具就像 kubernetes 的命令行工具一样，可以从终端执行一些 istio 的操作。命令行工具在 `istio-1.1.0/bin/` 目录中，bin 目录中的 istioctl 添加到环境变量中即可使用

    ```sh
    chmod +x istio-1.1.0/bin/istioctl && cp istio-1.1.0/bin/istioctl /usr/local/bin/istioctl
    ```

3. 安装 istio

    进入 istio 安装文件夹
    ```sh
    cd istio-1.1.0
    ```

    添加 CRDs 到 kubernetes API-server
    ```sh
    for i in install/kubernetes/helm/istio-init/files/crd*yaml; do kubectl apply -f $i; done
    ```

    如果客户端之间需要身份认证，使用下面这条命令安装
    ```sh
    kubectl apply -f install/kubernetes/istio-demo-auth.yaml
    ```
    否则使用这条命令
    ```sh
    kubectl apply -f install/kubernetes/istio-demo.yaml
    ```

至此 istio 安装完成，第一次安装会从远程仓库拉取镜像，等待一会安装完成
