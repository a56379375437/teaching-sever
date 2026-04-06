import Router from '@koa/router'
import { QuestionService } from '../model/index.js'
import { sendSuccess, sendError } from '../type/index.js';

// 子路由：/api/questions
const questionRouter = new Router({ prefix: '/questions' })

// 1. 获取所有题目
questionRouter.get('/', async (ctx) => {
  try {
    // 统一处理分页和筛选参数
    const { page = 1, limit = 10, type, level, knowledgeUnit, search } = ctx.query;

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));

    // 构建查询条件
    const where = {};
    if (type) where.type = type;
    if (level) where.level = level;
    if (knowledgeUnit) where.knowledgeUnit = knowledgeUnit;
    if (search) {
      where.title = { contains: search }; // 增加简单的模糊搜索支持
    }

    // 调用 Service
    const { list, total } = await QuestionService.getAllQuestions({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    sendSuccess(ctx, list, {
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    sendError(ctx, '获取题目列表失败: ' + error.message, 500);
  }
});

// 2. 获取单个题目
questionRouter.get('/:id', async (ctx) => {
  const { id } = ctx.params;
  const questionId = Number(id);

  if (isNaN(questionId)) return sendError(ctx, '无效的题目ID');

  const data = await QuestionService.getQuestionById(questionId);

  if (!data) {
    return sendError(ctx, '题目不存在', 404);
  }

  sendSuccess(ctx, data);
});

// 3. 创建题目
questionRouter.post('/', async (ctx) => {
  try {
    const body = ctx.request.body;

    // 基础校验
    if (!body.title || !body.type) {
      return sendError(ctx, '标题和类型为必填项');
    }

    const question = await QuestionService.createQuestion(body);
    sendSuccess(ctx, question);
  } catch (error) {
    sendError(ctx, '创建失败: ' + error.message, 500);
  }
});

// 4. 修改题目
questionRouter.put('/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    const questionId = Number(id);

    if (isNaN(questionId)) return sendError(ctx, '无效的题目ID');

    const updatedQuestion = await QuestionService.updateQuestion(questionId, ctx.request.body);
    sendSuccess(ctx, updatedQuestion);
  } catch (error) {
    sendError(ctx, '更新失败: ' + error.message, 500);
  }
});

// 5. 删除题目
questionRouter.delete('/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    const questionId = Number(id);

    if (isNaN(questionId)) return sendError(ctx, '无效的题目ID');

    await QuestionService.deleteQuestion(questionId);
    sendSuccess(ctx, null, { message: '删除成功' });
  } catch (error) {
    sendError(ctx, '删除失败: ' + error.message, 500);
  }
});

export default questionRouter;