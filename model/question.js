import Router from '@koa/router'
import router from '../router/index.js' // 正确导入总路由
import prisma  from '../prisma/index.js'

// 子路由：/api/questions
const questionRouter = new Router({ prefix: '/questions' })
// ==============================================
// 1. 获取所有题目
// ==============================================
questionRouter.get('/', async ctx => {
  const { page = 1, limit = 10, type, level, knowledgeUnit } = ctx.query
  const skip = (page - 1) * parseInt(limit)
  const take = parseInt(limit)

  const where = {}
  if (type) where.type = type
  if (level) where.level = level
  if (knowledgeUnit) where.knowledgeUnit = knowledgeUnit

  const [list, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' },
      include: {
        options: true,
        singleChoice: true,
        multipleChoice: true,
        judgment: true,
        fillBlank: true,
        calculation: true,
        shortAnswer: true,
      },
    }),
    prisma.question.count({ where }),
  ])

  ctx.body = {
    success: true,
    data: list,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
  }
})

// ==============================================
// 2. 获取单个题目
// ==============================================
questionRouter.get('/:id', async ctx => {
  const { id } = ctx.params
  const data = await prisma.question.findUnique({
    where: { id: parseInt(id) },
    include: {
      options: true,
      singleChoice: true,
      multipleChoice: true,
      judgment: true,
      fillBlank: true,
      calculation: true,
      shortAnswer: true,
    },
  })

  if (!data) {
    ctx.status = 404
    ctx.body = { success: false, msg: '题目不存在' }
    return
  }

  ctx.body = { success: true, data }
})

// ==============================================
// 3. 创建题目
// ==============================================
questionRouter.post('/', async ctx => {
  const { title, type, level, knowledgeUnit, score, creator, options, answer } =
    ctx.request.body

  const question = await prisma.question.create({
    data: {
      title,
      type,
      level,
      knowledgeUnit,
      score: score || 5,
      creator,
      options: { create: options || [] },
      ...(type === 'JUDGMENT' && { judgment: { create: { answer } } }),
      ...(type === 'FILL_BLANK' && {
        fillBlank: { create: { standardAnswer: answer } },
      }),
      ...(type === 'CALCULATION' && {
        calculation: { create: { standardAnswer: answer } },
      }),
      ...(type === 'SHORT_ANSWER' && {
        shortAnswer: { create: { standardAnswer: answer } },
      }),
      ...(type === 'SINGLE_CHOICE' && { singleChoice: { create: {} } }),
      ...(type === 'MULTIPLE_CHOICE' && { multipleChoice: { create: {} } }),
    },
  })

  ctx.body = { success: true, data: question }
})

// ==============================================
// 4. 修改题目
// ==============================================
questionRouter.put('/:id', async ctx => {
  const { id } = ctx.params
  const body = ctx.request.body

  await prisma.questionOption.deleteMany({
    where: { questionId: parseInt(id) },
  })

  const data = await prisma.question.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      type: body.type,
      level: body.level,
      knowledgeUnit: body.knowledgeUnit,
      score: body.score,
      options: { create: body.options || [] },
    },
  })

  ctx.body = { success: true, data }
})

// ==============================================
// 5. 删除题目
// ==============================================
questionRouter.delete('/:id', async ctx => {
  const { id } = ctx.params
  await prisma.question.delete({
    where: { id: parseInt(id) },
  })
  ctx.body = { success: true, msg: '删除成功' }
})

// 把题目路由挂载到总路由 /api/questions
router.use(questionRouter.routes(), questionRouter.allowedMethods())

export default router
