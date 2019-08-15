# kubeadm 部署 kubernetes

+ [前提条件](#前提条件)
+ [安装步骤](#安装步骤)
+ [多网卡问题](#多网卡问题)

> 多块网卡安装 kubernetes 请先看[多网卡问题](#多网卡问题)

## 前提条件

Ubuntu Linux 或者 CentOS

## 安装步骤

1. 设置仓库源

    CentOS 系统在`/etc/yum.repos.d/`目录下，使用下面命令设置仓库源
    ```sh
    curl -o CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
    curl -o docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo
    cat <<EOF > /etc/yum.repos.d/kubernetes.repo
    [kubernetes]
    name=Kubernetes
    baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
    enabled=1
    gpgcheck=0
    repo_gpgcheck=0
    gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
            http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
    EOF
    yum clean all
    yum makecache
    yum repolist
    ```
    Ubuntu 系统使用下面命令设置仓库

    ```sh
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common

    curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -

    add-apt-repository \
       "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
       $(lsb_release -cs) \
       stable"

    sudo apt-get update && sudo apt-get install -y apt-transport-https curl && \ sudo curl -s https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo apt-key add - 

    sudo tee /etc/apt/sources.list.d/kubernetes.list <<-'EOF'
    deb https://mirrors.aliyun.com/kubernetes/apt kubernetes-xenial main
    EOF

    apt-get update
    ```

2. 系统配置
    1. 关闭交换空间（如果有）
    ```sh
    swapoff -a
    sed -ri "s/.*.swap.*/#&/" /etc/fstab
    ```

    2. 禁用 SELinux（如果有）
    ```sh
    setenforce 0
    sed -i --follow-symlinks 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux
    ```

    3. 关闭防火墙（如果有）
    ```sh
    systemctl stop firewalld
    systemctl disable firewalld
    ```

    4. 设置内核参数
    ```sh
    echo 'net.bridge.bridge-nf-call-ip6tables = 1' >> /etc/sysctl.d/k8s.conf
    echo 'net.bridge.bridge-nf-call-iptables = 1' >> /etc/sysctl.d/k8s.conf
    echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.d/k8s.conf
    modprobe br_netfilter
    sysctl -p /etc/sysctl.d/k8s.conf
    ```

    5. 设置 hostname （单机可选，多节点需要设置防止冲突）
    ```sh
    hostnamectl set-hostname master
    ```
    > ubuntu-server 18.04 在执行上述命令之前需要执行 `sed -i "s|preserve_hostname: false|preserve_hostname: true|g" /etc/cloud/cloud.cfg` 防止重启 hostname 失效。桌面版本不用设置

3. 安装 Docker

    > [kubernetes github](https://github.com/kubernetes/kubernetes/) 上的 CHANGELOG 记录了 kubernetes 对 Docker 版本的要求，建议选好对应的 kubernetes 版本再安装 Docker。例如如果希望安装 Kubernetes 1.15，那么查看 [CHANGELOG-1.15.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.15.md)，可以查看到 Kuberentes 1.15 对 Docker 的最低版本要求是 1.13.1。

    CentOS 安装
    ```sh
    yum install -y docker-ce # 安装最新版
    yum install -y docker-ce-18.06.3.ce-3.el7 # 安装 18.06.3 版本
    ```

    > 使用 `yum list all docker-ce --showduplicates | sort -r` 查看可安装的版本

    Ubuntu 安装
    ```sh
    apt-get install -y docker-ce # 安装最新版
    apt-get install -y docker-ce=5:18.09.7~3-0~ubuntu-bionic # 安装指定版本
    ```

    > 使用 `apt-cache madison docker-ce ` 查看可安装的版本

4. Docker 设置

    ```sh
    echo '{"insecure-registries": ["0.0.0.0/0"]}' >> /etc/docker/daemon.json
    systemctl enable docker
    systemctl restart docker
    ```

5. 安装 kubeadm

    CentOS 安装
    ```sh
    yum install -y kubeadm # 安装最新的 kubeadm
    yum install -y kubeadm-1.14.1-0 # 安装 kubeadm 1.14.1
    ```

    > 使用 `yum list all kubeadm --showduplicates | sort -r` 查看可安装的版本

    Ubuntu 安装
    ```sh
    apt-get install -y kubeadm # 安装最新的 kubeadm
    apt-get install -y kubeadm=1.14.1-00 # 安装 kubeadm 1.14.1
    ```
    > 使用 `apt-cache madison kubeadm ` 查看可安装的版本

6. 配置 kubelet

    ```sh
    # kubelet 使用的 cgroup 要和 Docker 的 cgroup 一致
    sed -i '0,/"$/s/"$/ --cgroup-driver=cgroupfs"/' /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
    systemctl daemon-reload
    systemctl enable kubelet
    systemctl start kubelet
    ```

7. 初始化 Kubernetes 设置

    使用 `kubeadm config images list` 查看初始化所需要的镜像，当前版本为 1.14.1，需要的镜像有
    ```
    k8s.gcr.io/kube-apiserver:v1.14.1
    k8s.gcr.io/kube-controller-manager:v1.14.1
    k8s.gcr.io/kube-scheduler:v1.14.1
    k8s.gcr.io/kube-proxy:v1.14.1
    k8s.gcr.io/pause:3.1
    k8s.gcr.io/etcd:3.3.10
    k8s.gcr.io/coredns:1.3.1
    # kubernetes-dashboard 镜像，使用的 dashboard ui 不同版本也不同
    k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.1
    ```

    编写脚本从阿里云拉取镜像再 tag

    ```sh
    #! /bin/bash
    images=( # 这里的镜像列表是 kubeadm config images list 查看的列表去掉 k8s.gcr.io/ 得到的
    kube-apiserver:v1.14.1
    kube-controller-manager:v1.14.1
    kube-scheduler:v1.14.1
    kube-proxy:v1.14.1
    pause:3.1
    etcd:3.3.10
    coredns:1.3.1
    kubernetes-dashboard-amd64:v1.10.1
    )
    for imageName in ${images[@]} ; do
      docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
      docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName k8s.gcr.io/$imageName
    done
    ```

8. 主节点配置

    ```sh
    kubeadm init --pod-network-cidr=192.168.0.0/16
    ```

    这里使用的网络方案为 Calico 因此 `--pod-network-cidr` 等于  `192.168.0.0/16` 更多网络方案点击[这里](https://kubernetes.io/docs/concepts/cluster-administration/addons/)和[这里](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

    > 如果计算机 CPU 只有一个，需要加参数来忽略错误 --ignore-preflight-errors=NumCPU
    >
    > kubernetes 从 1.10 开始没有开放 10255 端口用于监控，如果需要监控需要配置
    > 
    >   ```sh
    >   echo 'readOnlyPort: 10255' >> /var/lib/kubelet/config.yaml
    >   systemctl restart kubelet
    >   ```

    按照 kubeadm 的要求设置

    ```sh
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    ```

    安装网络插件

    ```sh
    kubectl apply -f https://docs.projectcalico.org/v3.3/getting-started/kubernetes/installation/hosted/rbac-kdd.yaml
    kubectl apply -f https://docs.projectcalico.org/v3.3/getting-started/kubernetes/installation/hosted/kubernetes-datastore/calico-networking/1.7/calico.yaml
    ```

    master 节点参与调度（多节点可选，单节点必选）

    kubeadm 安装的 kubernetes 环境默认情况下 Master 节点不会参与调度，想要让 Master 节点参与调度需要使用下面命令
  
    ```sh
    kubectl taint nodes <master-node-name> node-role.kubernetes.io/master:NoSchedule-
    ```

    安装 dashboard-ui （可选）

    ```sh
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml
    ```

    默认情况下 kubernetes dashboard 使用集群端口，如果需要在外部访问，需要将 kuberntes dashboard 服务的类型改为 NodePort
  
    ```sh
    kubectl edit svc kubernetes-dashboard -n kube-system
    ```
  
    默认情况下，kuberntes dashboard 使用 ***https*** 协议，而且访问 kubernetes dashboard 需要有 Token 或者 kubeconfig 文件
  
    使用 Token 方式访问 UI，需要先创建 ServiceAccount，然后将账户和 admin 角色绑定，创建 kubernetes-admin.yaml 文件，写入下面内容
  
    ```yaml
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: admin-user
      namespace: kube-system
    ---
    apiVersion: rbac.authorization.k8s.io/v1beta1
    kind: ClusterRoleBinding
    metadata:
      name: admin-user
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
    - kind: ServiceAccount
      name: admin-user
      namespace: kube-system
    ```
  
    使用下面命令使用配置生效
    ```sh
    kubectl apply -f kubernetes-admin.yaml
    ```
    之后使用下面命令获取用于访问 dashboard 的 Token
    ```sh
    kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}') | grep token:
    ```
9. 加入集群（可选）

    将一个节点加入集群需要进行上述 1 到 7 步，之后使用下面命令将节点添加到集群
    ```sh
    kubeadm join <master-ip> --token <join-token> --discovery-token-unsafe-skip-ca-verification
    ```

    `<master-ip>` Kubernetes 集群 master 节点所在的 ip 地址，例如: 192.168.17.139:6443

    `<join-token>` 为加入 Kubernetes 集群所需要的 token，可以通过 `kubeadm token list` 查看，如果没有，可以通过 `kubeadm token create` 创建 token

10. 额外配置（可选）

    上述安装配置无法对集权状态进行监控，如需监控功能需要将 10255 端口添加到配置文件，设置方式如下。配置文件在 `kubeadm init` 或 `kubeadm join` 命令生效后生成，使用 `kubeadm reset` 之后该文件会被删除。

    ```sh
    echo 'readOnlyPort: 10255' >> /var/lib/kubelet/config.yaml
    systemctl restart kubelet
    ```

## 多网卡问题

> 实验环境最好不要使用多网卡机器，容易出现各种问题

1. 安装 kubernetes

    在 `安装步骤-> 8. 主节点配置`中使用 `kubeadm init` 来安装 kubernetes，在安装过程中，kubeadm 会自动寻找可用的网卡做为 kubernetes 的服务 ip。如果计算机存在多张网卡，那么有可能选择的网卡并不是预期的网卡。为了解决这个问题，kubeadm 提供了 `--apiserver-advertise-address` 参数来指定网卡的 ip，完整命令如下:

    ```sh
    kubeadm init --apiserver-advertise-address <targetIP> --pod-network-cidr=192.168.0.0/16
    ```

    >  --pod-network-cidr=192.168.0.0/16 为 calico 网络插件指定的网段

    对于想要加入 kubernetes 集群的节点来，如果有多网卡，也可以使用该参数来指定加入的网卡

    ```sh
    kubeadm join <k8s-master-ip> --token <token> --apiserver-advertise-address <targetIP>
    ```

2. 网络插件选择网卡

    除了 kubernetes 以外，网络插件也需要选择网卡来保证节点间容器的通信，不同的网络插件对于网卡的选择不同，具体请查看实际网络插件的文档。这里以 `calico` 网络插件为例。[calico 官方文档](https://docs.projectcalico.org/v3.7/reference/node/configuration#ip-autodetection-methods)

    calico 对于网卡的选择使用的默认策略是 `first-found`，也就是第一块找到的可用的网卡，如果每个节点选择的网卡对应的 ip 不在同一网段，那么很可能出现某一节点上的 pod ping 不通另一节点上的 pod。

    对于这种情况，可以根据不同方式来自行选择网卡，这里使用的网卡选择策略是 `interface`，根据正则表达式来选择网卡，不同的网卡选择策略还是看[calico 官方文档](https://docs.projectcalico.org/v3.7/reference/node/configuration#ip-autodetection-methods)。

    在 `kube-system` 命令空间下，找到 `守护进程集(daemonse) calico-node`，其中包含两个 container，为 `calico-node` container 增加两个环境变量 `IP_AUTODETECTION_METHOD` 和 `IP6_AUTODETECTION_METHOD`，值为 `interface=eth0`。保存即可，和下面类似

    ```yaml
    env:
    ....
    - name: IP_AUTODETECTION_METHOD
      value: interface=eth0
    - name: IP6_AUTODETECTION_METHOD
      value: interface=eth0
    ....
    ```

    这个环境变量的意思是 calico 选择网卡，根据正则表达式去匹配每个节点上网卡名称，找到的第一个网卡就作为 pod 通信的网卡。这里要选择的网卡就是包含 `eht0` 的网卡。