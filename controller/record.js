import Router from '@koa/router'
import { sendSuccess, sendError } from '../type/index.js'
import { RecordService } from '../model/index.js'

const recordRouter = new Router({ prefix: '/records' })

recordRouter.post('/submit', async ctx => {
  try {
    const { studentId, score, totalScore, knowledgeUnit } = ctx.request.body

    // 创建测评记录
    const record = await RecordService.createRecord({
      studentId,
      score,
      totalScore,
      knowledgeUnit,
    })

    // 更新学生的总积分
    await RecordService.updateStudentScore(studentId, score)

    sendSuccess(ctx, record, { message: '成绩保存成功' })
  } catch (error) {
    sendError(ctx, '保存成绩失败: ' + error.message, 500)
  }
})

export default recordRouter
