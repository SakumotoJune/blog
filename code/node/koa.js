const koa = require('koa');
const js = require('js');
const app = new koa();
const route = require('koa-route');
const serve = require('koa-static');
const fs = require('fs.promised');

// 中间件
// HTTP Request 和 HTTP Response 中间
// 多个中间件会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行。
// 洋葱式结构
const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.url}`);
  next();
}

// 异步中间件
// 必须写成aync
const asyncMain = async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = await fs.readFile('./demos/template.html', 'utf8');
}


// ctx 是koa传入的封装了request和reponse的变量
const about = ctx => {
  // 读写 Cookie
  const n = Number(ctx.cookies.get('view') || 0) + 1;
  ctx.cookies.set('view', n);
  ctx.response.type = 'html';
  ctx.response.body = '<a href="/">Index Page</a>';

  // 返回用户的网页
  // ctx.response.body = fs.createReadStream('./template');
};

// const main = ctx => {
//   ctx.response.body = 'Hello World';
// };

// 使用koa-static，实现静态资源
const main = serve(path.join(__dirname));

// ctx.request.path可以获取用户请求的路径，实现路由
// 使用koa-route更方便
// 根路径/的处理函数是main，/about路径的处理函数是about。
app.use(logger)
app.use(route.get('/', main));
app.use(route.get('/about', about))

app.listen(3000);
