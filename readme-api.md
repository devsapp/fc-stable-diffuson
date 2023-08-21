> 注：当前项目为 Serverless Devs
> 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、服务名、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制
> s.yaml 使用，**强烈推荐**通过 `s init` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# fc-stable-diffusion-api 帮助文档

<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-api&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-stable-diffusion-api" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-api&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-stable-diffusion-api" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-stable-diffusion-api&type=packageDownload">
  </a>
</p>

<description>

使用serverless devs将stable-diffusion 的api服务部署到阿里云函数计算上，支持自定义模型，可以共享已有的stable-diffusion服务

</description>

<codeUrl>

- [:smiley_cat: 代码](https://github.com/devsapp/fc-stable-diffuson)

</codeUrl>
<preview>

</preview>

## 前期准备

使用该项目，您需要有开通以下服务：

<service>

| 服务      | 备注 |
| ------- | -- |
| 函数计算 FC |    |
| 文件存储 NAS |    |

</service>

推荐您拥有以下的产品权限 / 策略：
<auth>

</auth>
## 应用介绍文档
### 应用详情
本应用旨在帮助开发者实现将[stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 开源应用部署到阿里云函数计算，保留其api服务，并且提供动态管理模型插件等能力
<appdetail id="flushContent">
</appdetail>

## 使用文档
### 本地部署方案
<deploy>

  - 安装 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install)  开发者工具`npm install @serverless-devs/s -g`
    ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init fc-stable-diffusion-api -d fc-stable-diffusion-api`
  - 进入项目，并进行项目部署：`cd fc-stable-diffusion-api && s deploy - y`
本地部署成功后使用部分参考应用中心部署方案配置管理后台系列操作
</deploy>

### 应用中心部署方案
### ![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683461638633-942efd24-2edf-41bd-8654-89f115e348ae.png#clientId=u03391672-5bf6-4&from=paste&height=895&id=u334249e9&originHeight=1790&originWidth=3548&originalType=binary&ratio=2&rotation=0&showTitle=false&size=2234309&status=done&style=none&taskId=u76368d40-2f09-4f3b-a3e4-de7f5e8485b&title=&width=1774)
通过模版创建应用-> 人工智能选项卡-> AI数字绘画stable-diffusion api服务->立即创建
### 填写表单项
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683461803985-e41d7585-5290-415f-aaf6-272cfea79c5b.png#clientId=u03391672-5bf6-4&from=paste&height=932&id=u8bafe9d1&originHeight=1864&originWidth=3386&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1934288&status=done&style=none&taskId=u02aec15c-b0cc-4c02-abc4-96700bc4faa&title=&width=1693)
选择直接部署-> 杭州/北京/上海/深圳地域 -> 复制开发者准备好的容器镜像
 杭州region: registry.cn-hangzhou.aliyuncs.com/serverlessdevshanxie/sd-auto-nas:apionly
   北京region: registry.cn-beijing.aliyuncs.com/serverlessdevshanxie/sd-auto-nas:apionly
   深圳region: registry.cn-shenzhen.aliyuncs.com/serverlessdevshanxie/sd-auto-nas:apionly
   上海region: registry.cn-shanghai.aliyuncs.com/serverlessdevshanxie/sd-auto-nas:apionly 
点击创建并部署默认环境
### 应用部署
接下来什么都不需要操作，等待应用部署即可，约花费5-10分钟， 如果你是技术同学，可以展开看看我们提供的部署日志，观察部署过程
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683461882180-9c03225c-6083-48dc-9d41-c4d250a4078f.png#clientId=u03391672-5bf6-4&from=paste&height=763&id=u3eafadd6&originHeight=1526&originWidth=2974&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1679012&status=done&style=none&taskId=u903b7e84-f059-4236-b21c-221e450f505&title=&width=1487)

### 配置管理后台
部署成功后得到两个域名
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683462322986-6dd3cc6c-de40-4f0f-aa9f-a08781fcec4d.png#clientId=u03391672-5bf6-4&from=paste&height=255&id=ua83aae53&originHeight=510&originWidth=1648&originalType=binary&ratio=2&rotation=0&showTitle=false&size=340481&status=done&style=none&taskId=ud1417aee-7314-4cfa-a4b6-83794124dae&title=&width=824)
其中sd开头的是主服务
admin开头的是我们的管理后台，您可以选择直接访问sd服务，我们提前为您准备了默认的sd1.5基础模型，也可以通过管理后台添加更多的模型和扩展，登录管理后台以及上传模型教程如下

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683462407669-d8321fe2-e5c3-4858-84be-e27fc51449fa.png#clientId=u03391672-5bf6-4&from=paste&height=923&id=uf26f0147&originHeight=1846&originWidth=3522&originalType=binary&ratio=2&rotation=0&showTitle=false&size=5431845&status=done&style=none&taskId=u2ade747c-a250-4d08-82d4-af7043ff905&title=&width=1761)
管理后台使用的是 可道云提供的 kod-box，对于你而言一路点点点，就可以
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683462449802-e95a58af-2aef-4908-a047-4e0a24a85b97.png#clientId=u03391672-5bf6-4&from=paste&height=620&id=u5de0c684&originHeight=1240&originWidth=1698&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1362726&status=done&style=none&taskId=u9b5f01bd-4296-408e-9bc7-5827c044b22&title=&width=849)
等初始化好之后，设置自己的登录账号和密码
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683462492174-aff0e298-c20a-42a2-8c26-7aceb3f89be2.png#clientId=u03391672-5bf6-4&from=paste&height=825&id=uec11eb95&originHeight=1650&originWidth=2722&originalType=binary&ratio=2&rotation=0&showTitle=false&size=3978912&status=done&style=none&taskId=ubb7da915-9392-48de-b946-3ce287ffc41&title=&width=1361)
之后进行登录
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683462570237-b92cd673-b0a8-4990-a2b0-6000e3c52f33.png#clientId=u03391672-5bf6-4&from=paste&height=604&id=u0cee9d6b&originHeight=1208&originWidth=1158&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1292053&status=done&style=none&taskId=uf04dc207-be0d-4fde-8218-0270a2fbf00&title=&width=579)
登录后在路径输入 /mnt/auto/sd
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683462657365-fbeffad5-959e-4146-93fc-7fc7870acba5.png#clientId=u03391672-5bf6-4&from=paste&height=877&id=u5bdf6be3&originHeight=1754&originWidth=3546&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1801931&status=done&style=none&taskId=u9f5ca6e2-c5c5-4681-a2fe-a921b95de25&title=&width=1773)
如果你熟悉sd-webui的目录的话，你可以看到对应的目录
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683462697869-704c768f-8081-40de-b9f8-695947d510a9.png#clientId=u03391672-5bf6-4&from=paste&height=722&id=u3075dff9&originHeight=1444&originWidth=3472&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1676917&status=done&style=none&taskId=ua4e68371-f843-439d-9049-bf2c8e8f6db&title=&width=1736)
接下来我们打开/mnt/auto/sd/models/Stable-diffusion/ ,然后点击上传->离线下载
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683462759753-fcb5f1f7-12b8-44c9-9386-ebdf6d8ca78f.png#clientId=u03391672-5bf6-4&from=paste&height=890&id=ud0edb1b4&originHeight=1780&originWidth=3564&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1855469&status=done&style=none&taskId=u990255b9-b49a-4a1e-833f-2399b066f98&title=&width=1782)


你也可以输入已经外部网站的模型地址，或者您先上传到阿里云OSS，通过同地域的内网地址进行下载，除了下载，你也可以把本地的模型直接拖拽上传。
因为模型较大，下载时间预计花费5-15分钟，可以休息等待一下（如果提升出错可以忽略）
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/13970/1683465959658-c672bd36-cde0-4d83-bef5-1e47f9c601ee.png#clientId=u03391672-5bf6-4&from=paste&height=795&id=u65ee50e7&originHeight=1590&originWidth=3524&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1670748&status=done&style=none&taskId=u1fa844fb-df6f-4672-982b-3f6d9406807&title=&width=1762)





<usedetail id="flushContent">

## 源码定制
如果您觉得我们提供的镜像能力不能满足您的需求，您可以通过社区开发者开放的构建[镜像源码](https://github.com/ai-app-with-serverless/fc-stable-diffusion-image/tree/apionly)进行重新构建


定制好自己的镜像之后可以替换上面流程中需要填写的镜像部分即可，注意对应好地域。


### 常见问题

#### 1. 冷启动时间较长如何优化？

因为本身sd的模型较大，打包镜像后依然达到10G，函数计算拉起镜像冷启动时间会比较长，大概2-5分钟，我们提供了预加载界面，避免您长时间的白屏等待。

#### 2.镜像加速

为了提升冷启动时间，我们提供了镜像加速服务，请关注控制台上的镜像加速状态，只有在ready才真正可用。

#### 3. 刚进去输入提示词构建偶尔会失败

这个可能是因为模型本身还未加载，请注意查看左上角选择框里面包含模型内容，之后再操作。出图的时候会有一定的等待时间，这个是正常现象，耐心等待即可

#### 4 资费消耗

GPU本身对算力资源消耗较大，我们默认提供的是按量付费的模式，当您不用的时候会自动释放资源，这样可以帮您减少资费消耗

#### 5 模型及插件扩展

需要自己上传

可以在进入admin后台管理地址之后在路径输入框输入
/mnt/auto/sd
然后进入models/Stable-diffusion 点击文件上传，选择”离线下载“并输入
https://huggingface.co/runwayml/stable-diffusion-inpainting/resolve/main/sd-v1-5-inpainting.ckpt

等带下载完成后需要修改文件名称，只保留sd-v1-5-inpainting.ckpt

#### 6 如何构建并使用stable-diffusion-webui 镜像

- 使用[stable-diffusion-webui-docker](https://github.com/AbdBarho/stable-diffusion-webui-docker)
  镜像本地镜像构建
- 将构建好的本地镜像托管到
  阿里云[容器镜像服务](https://help.aliyun.com/document_detail/257112.html?spm=a2c4g.410107.0.0.5b4036b9BUO0T5)服务,
  注意选择镜像服务的地域要跟函数计算部署的地域保持一致

</usedetail>

<devgroup>

## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在
[Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues)
中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：`serverless`</center>                                                                                               | <center>微信小助手：`xiaojiangwh`</center>                                                                                              | <center>钉钉交流群：`33947367`</center>                                                                                                 |

</p>
</devgroup>

## 免责声明

<disclaimers>

1.应用中心仅为您提供应用的逻辑关系，不为您托管任何资源。如果您部署的应用中，存在一定的资源收费现象，请参考对应产品的收费标准；如果您应用所使用的某些产品或者服务因为产品规划等原因发生了不兼容变更，建议您直接咨询对应的产品或者服务；
2.应用中心为您提供的默认流水线功能是免费的，如果您需要手动切换到自定义流水线可能涉及到资源使用费用，具体的收费标准需要参考函数计算的计费文档；
3.应用中心部署的部分应用会为您分配“devsapp.cn”的测试域名，这个测试域名并非阿里云官方域名，是 CNCF Sandbox 项目 Serverless
Devs 所提供的测试域名，我们不保证该域名的使用时效性，推荐您只在测试的时候使用，或者绑定自己的自定义域名进行使用；
4.应用部署过程中，如果提示“当前应用模板由社区贡献，非阿里云官方提供，推荐您在使用当前应用模板前仔细阅读应用详情，以确保应用的安全，稳定等”则表示该应用并非阿里云官方所提供的应用，我们仅作为收录和展示，如果您继续部署该应用，推荐您联系应用的作者，并与作者协商应用使用的相关协议等；

</disclaimers>