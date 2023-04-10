
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
| 函数计算 FC |  undefined |

</service>

推荐您拥有以下的产品权限 / 策略：
<auth>
</auth>

<remark>

您还需要注意：   
1. 为优化首次加载体验，减少白屏等待时间，本项目提供了一个专门展是预加载页面的代理函数stable-diffusion-portal，如果您在意相关的资费消耗，可以选择删除，直接sd-server函数
2. 本次构建的stable-diffusion模型固化到镜像中，您无法修改和添加模型，包括生成的图片因为冷启动无法持久化保存，请在生成后自行保存
3.使用GPU渲染会有资费消耗，使用的时候请注意自己的消费额度。

</remark>

<disclaimers>

免责声明：   
1.应用中心仅为您提供应用的逻辑关系，不为您托管任何资源。如果您部署的应用中，存在一定的资源收费现象，请参考对应产品的收费标准；如果您应用所使用的某些产品或者服务因为产品规划等原因发生了不兼容变更，建议您直接咨询对应的产品或者服务；
2.应用中心为您提供的默认流水线功能是免费的，如果您需要手动切换到自定义流水线可能涉及到资源使用费用，具体的收费标准需要参考函数计算的计费文档；
3.应用中心部署的部分应用会为您分配“devsapp.cn”的测试域名，这个测试域名并非阿里云官方域名，是 CNCF Sandbox 项目 Serverless Devs 所提供的测试域名，我们不保证该域名的使用时效性，推荐您只在测试的时候使用，或者绑定自己的自定义域名进行使用；
4.应用部署过程中，如果提示“当前应用模板由社区贡献，非阿里云官方提供，推荐您在使用当前应用模板前仔细阅读应用详情，以确保应用的安全，稳定等”则表示该应用并非阿里云官方所提供的应用，我们仅作为收录和展示，如果您继续部署该应用，推荐您联系应用的作者，并与作者协商应用使用的相关协议等；

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

### 常见问题
#### 1. 冷启动时间较长如何优化？
因为本身sd的模型较大，打包镜像后依然达到10G，函数计算拉起镜像冷启动时间会比较长，大概2-5分钟，我们提供了预加载界面，避免您长时间的白屏等待。
####  2.镜像加速
为了提升冷启动时间，我们提供了镜像加速服务，请关注控制台上的镜像加速状态，只有在ready才真正可用。
#### 3. 刚进去输入提示词构建偶尔会失败
这个可能是因为模型本身还未加载，请注意查看左上角选择框里面包含模型内容，之后再操作。出图的时候会有一定的等待时间，这个是正常现象，耐心等待即可

#### 4 资费消耗
GPU本身对算力资源消耗较大，我们默认提供的是按量付费的模式，当您不用的时候会自动释放资源，这样可以帮您减少资费消耗

#### 5 模型及插件扩展
目前版本不支持模型和插件的动态扩展，如您有需求，可以加入我们官方群中提出



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
