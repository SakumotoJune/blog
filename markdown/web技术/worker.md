## 概述
js语言采用的是单线程模型，单线程无法发挥计算机计算能力。
Web Worder 就是给js创建多线程环境，允许主线程创建Worker线程，将一血任务分配给后者
主线程运行的同时，Worker线程在后台执行，两者互不干扰


## Web Worker有一下几个使用注意点。
  1. 同源限制
    分配给Worker线程运行的脚本文件，必须与主线程的脚本文件同源

  2. DOM 限制
    Worker线程所在的全局对象，跟主线程不一样，无法读取主线程所在网页DOM，也没办法使用document、window、parent这些对象。但是，Worker 线程可以navigator对象和location对象。

  3. 通信联系

    Worker线程跟主线程不在同一个上下文环境

  4. 脚本限制
    Worker 线程不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。

  5. 文件限制
    Worker线程无法读取本地文件


## 基本用法

  ```javascript
  var worker = new Worker('work.js');
  ```

1. 主线程：调用worker.postMessage()传递消息


  ```javascript
  worker.postMessage('Hello World');
  worker.postMessage({method: 'echo', args: ['Work']});
  ```
  worker.postMessage()方法的参数，就是主线程传给 Worker 的数据。它可以是各种数据类型，包括二进制数据。

  主线程通过worker.onmessage指定监听函数，接收子线程发回来的消息。

  ```javascript
  worker.onmessage = function (event) {
    console.log('Received message ' + event.data);
    doSomething();
  }

  function doSomething() {
    // 执行任务
    worker.postMessage('Work done!');
  }
  ```

  主线程关闭子线程
  ```javascript
  worker.terminate();
  ```
2. Worker 线程

  Worker 线程内部需要有一个监听函数，监听message事件。

  ```javascript
  self.addEventListener('message', function (e) {
    self.postMessage('You said: ' + e.data);
  }, false);
  ```

3. Worder加载脚本

  Worker 内部如果要加载其他脚本，有一个专门的方法importScripts()。


## 数据通信

前面说过，主线程与 Worker 之间的通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即是传值而不是传址，Worker 对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原。

主线程与 Worker 之间也可以交换二进制数据，比如 File、Blob、ArrayBuffer 等类型，也可以在线程之间发送。下面是一个例子。

```javascript
// 主线程
var uInt8Array = new Uint8Array(new ArrayBuffer(10));
for (var i = 0; i < uInt8Array.length; ++i) {
  uInt8Array[i] = i * 2; // [0, 2, 4, 6, 8,...]
}
worker.postMessage(uInt8Array);

// Worker 线程
self.onmessage = function (e) {
  var uInt8Array = e.data;
  postMessage('Inside worker.js: uInt8Array.toString() = ' + uInt8Array.toString());
  postMessage('Inside worker.js: uInt8Array.byteLength = ' + uInt8Array.byteLength);
};
```

但是，拷贝方式发送二进制数据，会造成性能问题。为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了。
这是为了防止出现多个线程同时修改数据的麻烦局面。这种转移数据的方法，叫做Transferable Objects。这使得主线程可以快速把数据交给 Worker，对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担。

```javascript
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer]);

// 例子
var ab = new ArrayBuffer(1);
worker.postMessage(ab, [ab]);
```

## 实例：Worker线程完成轮询
轮询服务器状态，以便第一时间通知状态

```javascript
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() +')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

var pollingWorker = createWorker(function (e) {
  var cache;

  function compare(new, old) { ... };

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json();

      if (!compare(data, cache)) {
        cache = data;
        self.postMessage(data);
      }
    })
  }, 1000)
});

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```