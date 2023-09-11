
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、服务名、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 `s init ` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# fc-stable-diffusion-plus 帮助文档
<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-plus&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-stable-diffusion-plus" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-plus&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-stable-diffusion-plus" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-plus&type=packageDownload">
  </a>
</p>

<description>

使用serverless devs将stable-diffusion部署到阿里云函数计算上,支持模型自定义

</description>

<codeUrl>

- [:smiley_cat: 代码](https://github.com/devsapp/fc-stable-diffuson)

</codeUrl>
<preview>



</preview>


## 前期准备

使用该项目，您需要有开通以下服务：

<service>



| 服务 |  备注  |
| --- |  --- |
| 函数计算 FC |  对AIGC进行GPU推理计算，新用户请先领取 <a href="https://free.aliyun.com/?product=9555928&crowd=personal" target="_blank">试用资源包</a> |

</service>

推荐您拥有以下的产品权限 / 策略：
<auth>
</auth>

<remark>

您还需要注意：   
1.本项目支持自定义模型，并且提前预置了sd1.5的基础模型，自定义模型需要通过kodbox管理后台进行上传
2.项目依赖阿里云函数计算和阿里云文件存储Nas，这两款产品都会产生资费，请关注您的资源包使用情况和费用情况
3.项目部署成功之后确保模型加载完毕（左上角选择框有模型显示）再开始推理
4.项目初始启动有大约1分钟的白屏时间，这是服务完全冷启动的状态，请耐心等待
5.项目里面的插件安装推荐下载到本地再通过kodbox管理后台上传，因为网络关系，在线安装有失败的情况

</remark>

<disclaimers>

免责声明：   
1. 该项目的构建镜像及应用模板完全开源，由社区开发者贡献，阿里云仅提供了算力支持；
2. 项目使用的sd-webui镜像内容同步自开源社区，如遇软件使用问题可以去社区查看问题答案

</disclaimers>

## 部署 & 体验

<appcenter>
   
- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=fc-stable-diffusion-plus) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=fc-stable-diffusion-plus) 该应用。
   
</appcenter>
<deploy>
    
- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init fc-stable-diffusion-plus -d fc-stable-diffusion-plus `
  - 进入项目，并进行项目部署：`cd fc-stable-diffusion-plus && s deploy - y`
   
</deploy>

## 应用详情

<appdetail id="flushContent">

## 前期准备

使用该项目，您需要有开通以下服务：


| 服务      | 备注 |
| ------- | -- |
| 函数计算 FC |    |


推荐您拥有以下的产品权限 / 策略：

## 应用介绍文档
### 应用详情
本应用旨在帮助开发者实现将[stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 开源应用部署到阿里云函数计算，并且提供动态管理模型插件等能力

## 使用文档
### 本地部署方案
  - 安装 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install)  开发者工具`npm install @serverless-devs/s -g`
    ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init fc-stable-diffusion-plus -d fc-stable-diffusion-plus`
  - 进入项目，并进行项目部署：`cd fc-stable-diffusion-plus && s deploy - y`
本地部署成功后使用部分参考应用中心部署方案配置管理后台系列操作

### 应用中心部署方案

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683461638633-942efd24-2edf-41bd-8654-89f115e348ae.png#clientId=u03391672-5bf6-4&from=paste&height=895&id=u334249e9&originHeight=1790&originWidth=3548&originalType=binary&ratio=2&rotation=0&showTitle=false&size=2234309&status=done&style=none&taskId=u76368d40-2f09-4f3b-a3e4-de7f5e8485b&title=&width=1774)
通过模版创建应用-> 人工智能选项卡-> AI数字绘画stable-diffusion自定义模板->立即创建

</appdetail>

## 使用文档

<usedetail id="flushContent">

## 源码定制
如果您是一名开发同学，可以构建自己的镜像
基于[https://github.com/AbdBarho/stable-diffusion-webui-docker/tree/master/services/AUTOMATIC1111](https://github.com/AbdBarho/stable-diffusion-webui-docker/tree/master/services/AUTOMATIC1111)这个项目，

社区准备了优化好的镜像,
+ 增加deforum扩展的镜像： https://github.com/ai-app-with-serverless/fc-stable-diffusion-image/tree/master
+ 仅包含api服务的镜像：https://github.com/ai-app-with-serverless/fc-stable-diffusion-image/tree/apionly

### 常见问题

#### 1. 冷启动时间较长如何优化？

因为本身sd的模型较大，打包镜像后依然达到10G，函数计算拉起镜像冷启动时间会比较长，大概2-5分钟，我们提供了预加载界面，避免您长时间的白屏等待。

#### 2. 刚进去输入提示词构建偶尔会失败

这个可能是因为模型本身还未加载，请注意查看左上角选择框里面包含模型内容，之后再操作。出图的时候会有一定的等待时间，这个是正常现象，耐心等待即可

#### 3 资费消耗

GPU本身对算力资源消耗较大，我们默认提供的是按量付费的模式，当您不用的时候会自动释放资源，这样可以帮您减少资费消耗

#### 4 模型及插件扩展

需要自己上传

可以在进入admin后台管理地址之后在路径输入框输入
/mnt/auto/sd
然后进入models/Stable-diffusion 点击文件上传，选择”离线下载“并输入您的模型地址

#### 6 如何构建并使用stable-diffusion-webui 镜像

- 使用[stable-diffusion-webui-docker](https://github.com/AbdBarho/stable-diffusion-webui-docker)
  镜像本地镜像构建
- 将构建好的本地镜像托管到
  阿里云[容器镜像服务](https://help.aliyun.com/document_detail/257112.html?spm=a2c4g.410107.0.0.5b4036b9BUO0T5)服务,
  注意选择镜像服务的地域要跟函数计算部署的地域保持一致

</usedetail>


<devgroup>


## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">  

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：`serverless`</center>                                                                                         | <center>微信小助手：`xiaojiangwh`</center>                                                                                        | <center>钉钉交流群：`33947367`</center>                                                                                           |
</p>
</devgroup>
