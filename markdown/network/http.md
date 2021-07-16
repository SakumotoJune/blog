# HTTP

## HTTP请求流程

### 整体流程

![http](https://user-gold-cdn.xitu.io/2020/7/4/1731a0797ee78e56?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

HTTP的请求流程如图，为了更好的说明，举例。

如果你在浏览器地址栏输入url，那么接下来浏览器会完成那些动作呢

1. 构建请求

        GET /index.html HTTP1.1

2. 查找缓存

    在真正发起请求之前，浏览器会现在浏览器缓存中查询是否有要请求的文件。如果发现可用缓存，会拦截请求，返回该资源的副本，直接结束请求。

3. 准备IP地址和端口

    ![tcp&http](https://user-gold-cdn.xitu.io/2020/7/4/1731a07e9de33cc8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

    浏览器使用HTTP作为应用层协议，封装文本信息，使用TCP/IP作为传输层协议将它发到网络上。关系如图。

    因此我们想要发送HTTP请求，首先需要建立TCP连接，而建立TCP连接需要IP和端口。于是我们第一步要做的就是通过url获取IP和端口。

    此处又引出一个域名和IP做映射的服务，DNS。
    //TODO: 补充DNS链接。

    至于端口，如果url没有指明，HTTP默认使用80.

4. 等待TCP队列

    根据不同的浏览器，有不同的规定。chrome规定一个域名最多只能建立6个TCP连接，如果在同一域名下同时有10个请求发生，那么剩余的4个会进入排队状态。

5. 建立TCP连接

    >TCP是面向连接的，可靠的，基于字节流的传输层通行协议。

    一个完整的TCP连接生命周期：建立连接，传输数据，断开连接

    ![tcplink](https://user-gold-cdn.xitu.io/2020/7/4/1731a08556f4dc6d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

6. 发送HTTP请求

    ![xx](https://user-gold-cdn.xitu.io/2020/7/4/1731a08c0a1dc8f3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

7. 服务器处理HTTP请求流程

    ![返回请求](https://user-gold-cdn.xitu.io/2020/7/4/1731a091ba9262f5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

    一般情况下，服务器发送完数据后，就要关闭TCP连接。不过有一种情况特殊

        Connection:Keep-Alive

    如果请求头中有如上字段，TCP连接仍然保持，这样子浏览器可以通过一个TCP连接发送请求，剩下重新建立连接的时间。

    特殊情况：重定向
    >状态码301，重定向的地址包含在响应头的Location中。

### 经典题目

* 为什么站点第二次打开速度会快
* 登录过一个网站后，下次再访问，已经处于登录状态，怎么做到的
* 如何使用Cookie来进行状态管理
* TCP建立过程
* UDP了解吗，跟TCP相比，优缺点
* TCP连接会存在TCP队列，那加载大量图片或者资源，怎么解决卡顿
