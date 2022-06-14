var http = require('http');
// 导入文件读写的js
var fs = require('fs');
var server = http.createServer(function (request, response) {
  console.log('someone has visited my first node server !');
  //根据访问的路径来选择响应的文件
  let filePath;
  if (request.url === '/') {
    filePath = 'demo.html';
    //读取文件并写入响应内容中去
    response.writeHead(200, { 'content-type': 'text/html;charset="utf-8"' })
    fs.readFile(filePath, 'utf-8', function (err, data) {
      response.write(data);
      //我写data.toString() 会报错
      // response.end();
      response.end();
    })
  } else {
    filePath = request.url.split('/')[1];
    //读取文件并写入响应内容中去
    console.log('..', filePath)
    response.writeHead(200)
    fs.readFile(filePath, function (err, data) {
      response.write(data);
      //不能直接写data 是16进制的数，需要转成字符串
      //我写data.toString() 会报错
      // response.end();
      response.end();
    })
  }
})
server.listen(8080, function () {
  console.log('server started at http://localhost:8080  ......')
});
