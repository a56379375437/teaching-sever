import Router from "@koa/router";
import { READMERouter, questionRouter } from '../controller/index.js'

const router = new Router({
  prefix: "/api",
});


// 把题目路由挂载到总路由 /api/questions
router.use(questionRouter.routes(), questionRouter.allowedMethods())
// 挂载README路由
router.use(READMERouter.routes(), READMERouter.allowedMethods())

export default router;
