const Koa = require('koa');
const router = require('koa-router')();  //注意：引入的方式
const koaBody = require('koa-body');
const fs = require('fs');
const path = require('path')
const app = new Koa();

app.use(koaBody({
  multipart: true,
  formidable:{
    // uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    onFileBegin:(name,file) => { // 文件s上传前的设置
      console.log(`name: ${name}`);
      console.log(file);
    }
  }
}));

router.get('/', function (ctx, next) {
  ctx.body="Hello koa";
})


router.post('/upload',(ctx, next)=>{
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, 'uploads/') + `/${file.name}`;

  let dirPath = filePath.split('/').slice(0, -1).join('/')
  console.log(dirPath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
   }
  const upStream = fs.createWriteStream(filePath, {
    flags: 'a'
  });
  reader.pipe(upStream);
  return ctx.body = {
    code: 0
  };
});


app.use(router.routes()); //作用：启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头
app.listen(3022,()=>{
  console.log('starting at port 3022');
});
