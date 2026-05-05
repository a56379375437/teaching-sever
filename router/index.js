import Router from "@koa/router";
import { READMERouter, questionRouter, aiQuestionRouter, userRouter, recordRouter } from '../controller/index.js'

const router = new Router({
  prefix: "/api",
});


// 把题目路由挂载到总路由 /api/questions
router.use(questionRouter.routes(), questionRouter.allowedMethods())
// 挂载README路由
router.use(READMERouter.routes(), READMERouter.allowedMethods())
// 挂载ai相关路由
router.use(aiQuestionRouter.routes(), aiQuestionRouter.allowedMethods())
// 挂载用户路由
router.use(userRouter.routes(), userRouter.allowedMethods())

router.use(recordRouter.routes(), recordRouter.allowedMethods())

export default router;
