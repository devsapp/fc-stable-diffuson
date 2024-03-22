
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 `s init ${模版名称}` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# fc-stable-diffusion-v3 帮助文档
<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-v3&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-stable-diffusion-v3" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-v3&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-stable-diffusion-v3" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-v3&type=packageDownload">
  </a>
</p>

<description>

使用serverless devs将stable-diffusion部署到阿里云函数计算上

</description>

<codeUrl>



</codeUrl>
<preview>



</preview>


## 前期准备

使用该项目，您需要有开通以下服务并拥有对应权限：

<service>



| 服务/业务 |  权限  | 相关文档 |
| --- |  --- | --- |
| 函数计算 |  创建函数 | [帮助文档](https://help.aliyun.com/product/2508973.html) [计费文档](https://help.aliyun.com/document_detail/2512928.html) |

</service>

<remark>



</remark>

<disclaimers>



</disclaimers>

## 部署 & 体验

<appcenter>
   
- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=fc-stable-diffusion-v3) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=fc-stable-diffusion-v3) 该应用。
   
</appcenter>
<deploy>
    
- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init fc-stable-diffusion-v3 -d fc-stable-diffusion-v3`
  - 进入项目，并进行项目部署：`cd fc-stable-diffusion-v3 && s deploy -y`
   
</deploy>

## 案例介绍

<appdetail id="flushContent">

本案例将 [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)，这一火热的 AIGC 项目快速创建并部署到阿里云函数计算 FC。快速体验强大的 AI 图片生成能力，实现文生图、图生图等多种功能。


Stable Diffusion 是一款开源的扩散模型，由 CompVis、Stability AI 和 LAION 的研究人员和工程师创建。由于 Stable Diffusion 开源、扩展性强的特点，其受到了全球众多 AIGC 爱好者的追捧。根据模型网站 Civital 统计，目前最热门的模型已经超过 100 万次下载，超过 10 万次下载的模型 70 余个，各种风格、不同功能的模型超过 12 万。Stable Diffusion WebUI 在国内也很火热，通过 Stable Diffusion WebUI 进行文生图的教程在国内各大平台多次登入热搜榜、排行榜，引领了一波又一波的浪潮。


Stable Diffusion WebUI 需要通过 GPU 算力进行运算，且部署存在一定的门槛要求。因此借助于 Serverless 开发平台，用户可以简单、方便地将 Stable Diffusion WebUI 部署至函数计算，快速感受 AIGC 的魅力。同时，开发平台还集成了包括热门模型库、云上文件管理、Serverless API 等多种定制化能力，方便不同的用户更好地使用 Stable Diffusion WebUI。

</appdetail>

## 使用流程

<usedetail id="flushContent">

部署完成后，点击 WebUI 域名，进入 Stable Diffusion WebUI 页面  
![进入 WebUI](https://img.alicdn.com/imgextra/i1/O1CN017nVu2A21J6kEkXGHo_!!6000000006963-0-tps-750-424.jpg)


点击页面右侧的生成，即可生成您的第一张图片  
![出图](https://img.alicdn.com/imgextra/i3/O1CN01DRInqG1UacZJgzUXs_!!6000000002534-0-tps-750-203.jpg)


Stable Diffusion WebUI 使用可参考任意平台的热门教程，也可以参考 Stable Diffusion 文档：https://alidocs.dingtalk.com/i/p/x9JOGOjr65om4QLAdy0mV8B0gpkodz89

</usedetail>

## 注意事项

<matters id="flushContent">

- Stable Diffusion 及 Stable Diffusion WebUI 为开源项目，代码由开源社区维护，对项目存在疑问可以前往社区寻求帮助；
- 如果您在使用中，对于第三方插件存在疑问，可以在插件社区寻求帮助；
- 函数计算为 Serverless 产品，数据存储在文件管理 NAS 中。如果您开启了模型管理管理功能，将会为您自动开启 NAS 服务，NAS 将根据存储的文件大小进行计费；
- 为保证 Stable Diffusion 运行质量，默认创建的 NAS 为通用性能型 NAS，费用为标准通用型 NAS 的 5.4 倍（具体折算比例请参考 NAS 文档）。

</matters>


<devgroup>


## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">  

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：`serverless`</center>                                                                                         | <center>微信小助手：`xiaojiangwh`</center>                                                                                        | <center>钉钉交流群：`33947367`</center>                                                                                           |
</p>
</devgroup>
