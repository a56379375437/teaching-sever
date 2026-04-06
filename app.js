import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import router from './router/index.js'
import { errorHandler } from './middleware/index.js'
import './model/question.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = new Koa()

// 全局异常捕获
process.on('uncaughtException', (err, origin) => {
  console.log(`Caught exception: ${err}\nException origin: ${origin}`)
})

// 中间件
app.use(bodyParser())
app.use(errorHandler())

// 路由（接口）
app.use(router.routes())
app.use(router.allowedMethods())

// 托管前端静态资源
app.use(koaStatic(join(__dirname, '../teaching-assistance/dist')))

app.use(async (ctx, next) => {
  // 如果是 API 接口，直接跳过，不返回页面
  if (ctx.path.startsWith('/api')) {
    return next()
  }

  ctx.set('Content-Type', 'text/html')
  ctx.body = await fs.readFile(
    join(__dirname, '../teaching-assistance/dist/index.html'),
    'utf-8'
  )
})

// 生成接口文档


// 启动
app.listen(8080, () => {
  console.log('服务已运行在 http://127.0.0.1:8080')
})
