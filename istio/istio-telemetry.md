# 遥测

![](./img/arch.svg)

![](./img/topology-without-cache.svg)

由 istio 架构可以知道，收集和展示数据使用 Mixer 组件。Mixer 通过和 Proxy 进行通讯收集数据，然后通过各种开源软件显示出来。
