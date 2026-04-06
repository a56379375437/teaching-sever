import Router from '@koa/router'
import { getREADMEModel } from '../model/index.js'

// 子路由：/api/README
const READMERouter = new Router({ prefix: '/README' })

export const getREADME = async ctx => {
  try {
    console.log('getREADME')
    const readmeContent = await getREADMEModel()
    ctx.body = readmeContent
  } catch (error) {
    ctx.status = 500
    ctx.body = error.message
  }
}

READMERouter.get('/', getREADME)

export default READMERouter
