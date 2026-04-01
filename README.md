# video-extractor

一键提取哔哩哔哩、YouTube 和 Vimeo 视频信息

## 通用浏览器扩展的基础代码框架

1. manifest.json (扩展配置文件)
这是扩展的“身份证”，声明了我们使用的是最新的 V3 版本，并申请了读取当前标签页内容的权限。
2. popup.html (扩展交互界面)
当你点击浏览器右上角扩展图标时弹出的界面。我们提供一个按钮和一个显示结果的区域。
3. popup.js (核心提取逻辑)
参考了原仓库对多平台的支持逻辑。这里的核心是：扩展将一段 JavaScript 代码（extractVideoInfo）注入到你当前正在看的网页中去执行，抓取作者、时间、标题等信息，然后传回扩展界面并自动复制到剪贴板。

## 如何测试和安装：

在电脑上新建一个文件夹（例如命名为 video-extractor-ext）。

将上述三段代码分别保存为 manifest.json、popup.html 和 popup.js，放在该文件夹内。

打开你的 Chrome 或 Edge 浏览器，在地址栏输入 chrome://extensions/（Edge 为 edge://extensions/）。

打开右上角的 “开发者模式” 开关。

点击左上角的 “加载已解压的扩展程序”，选择你刚刚创建的文件夹。

## 打包成一个zip压缩包

### 方法一：手动打包（最简单直接）
在你的电脑上新建一个文件夹，命名为 video-extractor-ext。

在这个文件夹里，新建三个文本文件，分别命名为 manifest.json、popup.html 和 popup.js，然后把上面对应的代码分别粘贴进去并保存（注意确保文件后缀名正确，不要变成 .txt）。

打包压缩：

Windows 系统：右键点击这个 video-extractor-ext 文件夹 -> 选择“压缩为 ZIP 文件”（或“发送到” -> “压缩(zipped)文件夹”）。

Mac 系统：右键（或双指点击）这个文件夹 -> 选择“压缩 video-extractor-ext”。

这样你就得到了一个可以直接在浏览器或其他地方使用的 ZIP 压缩包了！

### 方法二：运行 Python 脚本一键生成
如果你电脑上装有 Python，你可以直接运行下面这段代码。它会自动帮你创建这三个文件，并将它们打包成一个 video-extractor.zip 文件，完全免去手动复制粘贴的烦恼。

新建一个 build_zip.py 文件，贴入以下代码并运行：

## 获取 YouTube API Key
1. 登录 [Google Cloud Console](https://console.cloud.google.com/)。
2. 创建一个新项目（或使用现有项目）。
3. 在左侧菜单进入 **API 和服务** -> **库**，搜索 `YouTube Data API v3` 并点击“启用”。
4. 转到 **凭据** -> **创建凭据** -> 选择 **API 密钥**。
5. 复制生成的这一长串密钥。
