
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、服务名、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 `s init ` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# fc-stable-diffusion 帮助文档
<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-stable-diffusion" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-stable-diffusion" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion&type=packageDownload">
  </a>
</p>

<description>

使用serverless devs将stable-diffusion部署到阿里云函数计算上

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
| 函数计算 FC |

</service>

推荐您拥有以下的产品权限 / 策略：
<auth>
</auth>

<remark>

您还需要注意：   
1. 项目依赖阿里云函数计算，这会产生资费，请关注您的资源包使用情况和费用情况 
2. 项目里面的插件安装推荐下载到本地再通过kodbox管理后台上传，因为网络关系，在线安装有失败的情况

</remark>

<disclaimers>

免责声明：   
该项目的构建镜像及应用模板完全开源，由社区开发者贡献，阿里云仅提供了算力支持；
项目使用的sd-webui镜像内容同步自开源社区，如遇软件使用问题可以去社区查看问题答案

</disclaimers>

## 部署 & 体验

<appcenter>
   
- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=fc-stable-diffusion) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=fc-stable-diffusion) 该应用。
   
</appcenter>
<deploy>
    
- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init fc-stable-diffusion -d fc-stable-diffusion `
  - 进入项目，并进行项目部署：`cd fc-stable-diffusion && s deploy - y`
   
</deploy>

## 应用详情

<appdetail id="flushContent">
</appdetail>

## 使用文档

<usedetail id="flushContent">

### 内置模型

#### 基础模型

共包含三种类型的基础模型预构建镜像

##### sd1.5

内置 `sd-v1-5-inpainting.ckpt` 镜像，绘制能力较强，可以根据描述词得到不同形式的图像

##### 动漫风格

内置 `mixProV4.Cqhm.safetensors` 镜像，支持绘制出动漫风格的图像  
（建议配合 VAE 模型 `cIF8Anime2.43ol.ckpt` 提升色彩表现能力）

[模型来源地址](https://civitai.com/models/7241/mix-pro-v4)


##### 真人风格

内置 `chilloutmix_NiPrunedFp16Fix.safetensors` 镜像，支持绘制出真人风格的图像

[模型来源地址](https://huggingface.co/samle/sd-webui-models/)

搭配了对应 Lora 模型

- `ChinaDollLikeness.safetensors`
- `KoreanDollLikeness.safetensors`
- `JapaneseDollLikeness.safetensors`

#### Lora & VAE 模型

|名称|类型|地址|介绍|
|:---:|:---:|:---:|:---:|
|`milkingMachine_v11.safetensors`|Lora|[模型来源](https://civitai.com/models/17516/abyssorangemix3-6-milk-cow-girl-2-milkingmachine-lora-by-racycats)|动漫风渲染|
|`blingdbox_v1_mix.safetensors`|Lora|[模型来源](https://civitai.com/models/25995/blindbox?modelVersionId=32988)|盲盒画风|
|`GachaSpliash4.safetensors`|Lora|[模型来源](https://civitai.com/models/13090/gacha-splash-lora)|带背景立绘风格|
|`Colorwater_v4.safetensors`|Lora|[模型来源](https://civitai.com/models/16055/colorwater)|水墨风渲染|
|`cIF8Anime2.43ol.ckpt`|VAE|[模型来源](https://civitai.com/models/7241/mix-pro-v4)|提升色彩表现|



### 内置插件

- [stable-diffusion-webui-chinese](https://github.com/VinsonLaro/stable-diffusion-webui-chinese) WebUI 汉化
- [sd-prompt-translator](https://github.com/studyzy/sd-prompt-translator) 中文提示词自动翻译
- [sdweb-easy-prompt-selector](https://github.com/blue-pen5805/sdweb-easy-prompt-selector) 提示词选择，[@路过银河​](https://zhuanlan.zhihu.com/p/630518048) 提供汉化


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
