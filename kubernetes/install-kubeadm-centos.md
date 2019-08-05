# Centos 使用 kubeadm 搭建单节点 kubernetes 环境

安装的 kubernetes 环境为 1.14

## 安装环境

Centos: 7.5

CPU: 1 核

内存: 2 G

## 安装步骤

1. 设置 yum 源

使用下面命令配置源，使用的镜像为阿里云

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

2. 安装 Docker

安装的 Docker 版本为 18.06

```sh
yum install -y docker-ce-18.06.3.ce-3.el7
systemctl enable docker
systemctl start docker
```

安装好后，可以通过 `docker version` 查看 Docker 版本

3. 环境配置

创建  `etc/sysctl.d/k8s.conf` 文件，文件内容如下:

```
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
```

使用下面命令使用配置生效

```sh
modprobe br_netfilter
sysctl -p /etc/sysctl.d/k8s.conf
```

关闭 SELinux

```sh
setenforce 0
sed -i --follow-symlinks 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux
```

关闭防火墙

```sh
systemctl stop firewalld
systemctl disable firewalld
```

临时关闭交换空间

```sh
swapoff -a
sed -ri "s/.*.swap.*/#&/" /etc/fstab
```

4. 安装 kubeadm

```sh
yum install -y kubeadm
```

>> 这里默认安装的是最新版本的 kubeadm 如果对安装版本有要求，需要指定

配置 kubelet

```sh
# 配置 kubelet 使用的 cgroup，这个要和 Docker 的 cgroup 一致
sed -i '0,/"$/s/"$/ --cgroup-driver=cgroupfs"/' /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
systemctl daemon-reload
systemctl enable kubelet
systemctl start kubelet
```

由于国内环境，无法从仓库拉取需要的镜像，因此需要从国内厂商拉取镜像再 tag 成需要的镜像名称

使用 `kubeadm config images list` 可以查看初始化需要的镜像，初始化需要的镜像有:

```
k8s.gcr.io/kube-apiserver:v1.14.1
k8s.gcr.io/kube-controller-manager:v1.14.1
k8s.gcr.io/kube-scheduler:v1.14.1
k8s.gcr.io/kube-proxy:v1.14.1
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.3.10
k8s.gcr.io/coredns:1.3.1
# kubernetes-dashboard 镜像
k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.1
```

编写脚本从阿里云拉取镜像再 tag

```sh
#! /bin/bash
images=(
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

安装完成后，使用下面命令初始化

```sh
kubeadm init --pod-network-cidr=10.244.0.0/16 --ignore-preflight-errors=NumCPU
```

> kubernetes 从 1.10 开始没有开放 10255 端口用于监控，如果需要监控需要配置
> 
>   echo 'readOnlyPort: 10255' >> /var/lib/kubelet/config.yaml
>  systemctl restart kubelet


由于 Centos 只有 1 核，因此需要 `--ignore-preflight-errors` 参数来忽略错误

按照要求执行命令

```sh
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

初始化完成之后，需要安装网络插件

```sh
kubectl apply -f https://docs.projectcalico.org/v3.3/getting-started/kubernetes/installation/hosted/rbac-kdd.yaml
kubectl apply -f https://docs.projectcalico.org/v3.3/getting-started/kubernetes/installation/hosted/kubernetes-datastore/calico-networking/1.7/calico.yaml
```

kubeadm 安装的 kubernetes 环境默认情况下 Master 节点不会参与调度，想要让 Master 节点参与调度需要使用下面命令

```sh
kubectl taint nodes <master-node-name> node-role.kubernetes.io/master:NoSchedule-
```

5. 配置 kubernetes

如果需要 UI 界面，需要下面命令安装 kubernest dashboard

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml
```

默认情况下 kubernetes dashboard 使用集群端口，如果需要在外部访问，需要将 kuberntes dashboard 服务的类型改为 NodePort

```sh
kubectl edit svc kubernetes-dashboard -n kube-system
```

默认情况下，kuberntes dashboard 使用 https 协议，而且访问 kubernetes dashboard 需要有 Token 或者 kubeconfig 文件

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

之后使用下面命令获取 Token

```sh
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}') | grep token:
```
