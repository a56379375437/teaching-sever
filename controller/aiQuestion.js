import Router from '@koa/router'
import OpenAI from 'openai'
import 'dotenv/config'

const aiQuestionRouter = new Router({ prefix: '/aiquestion' })

export const getaiQuestion = async ctx => {
  try {
    // 接收上下文参数
    const { prompt, type, knowledgeUnit } = ctx.request.body

    if (!prompt || prompt.length < 5) {
      ctx.status = 400
      ctx.body = { message: '请提供至少5个字的题目描述或关键词' }
      return
    }

    const openai = new OpenAI({
      apiKey: process.env.ALI_API_KEY,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    })

    // 增强 System Prompt，要求 AI 进行标题润色和逻辑对齐
    const systemPrompt = `
      你是一个资深的教育专家和出题助手。请根据用户提供的【原始描述】、候选【题目类型】和【知识单元】，生成一道与概率论与数理统计知识相关的高质量的题目。

      【核心要求】：
      1. 标题润色：用户提供的描述可能很简陋，请你基于描述，起一个专业、严谨、符合学术规范的“题目名称(title)”。
      2. 类型对齐：题目逻辑必须严格符合类型（如：SINGLE_CHOICE 只能有一个正确项；JUDGMENT 只能有对错）。
      3. 知识点注入：题目内容必须深度关联指定的知识单元。
      4. 返回格式：严格返回纯 JSON，不得包含 Markdown 标签。

      【可选枚举值定义】：
      - 题目类型(type): ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "JUDGMENT", "FILL_BLANK", "CALCULATION", "SHORT_ANSWER"]
      - 难度(level): ["EASY", "MEDIUM", "HARD"]
      - 知识单元(knowledgeUnit): ["LARGE_NUMBER_LAW", "CENTRAL_LIMIT_THEOREM", "CONFIDENCE_INTERVAL"]

      【返回 JSON 结构】：
      {
        "title": "润色后的专业题目名称",
        "type": "类型枚举值",
        "level": "匹配的难度",
        "knowledgeUnit": "匹配的知识点枚举",
        "score": 分数在数字3到7之间，根据难度变动,
        "answer": "标准答案文本",
        "options": [
          {"content": "选项内容", "isCorrect": true}
        ]
      }
    `

    //构建用户 Prompt
    const userPrompt = `
      请根据以下信息生成题目：
      - 原始描述/要求：${prompt}
      - 期望类型：${type || '未指定'}
      - 所属知识单元：${knowledgeUnit || '未指定'}
      注意：如果“期望类型”或“知识单元”已指定，请务必严格遵守。
    `

    const completion = await openai.chat.completions.create({
      model: 'deepseek-v4-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      enable_thinking: false,
    })

    const rawContent = completion.choices[0].message.content
    let aiResult = JSON.parse(rawContent.replace(/```json|```/g, '').trim())

    ctx.body = {
      code: 200,
      message: 'success',
      data: aiResult, // 返回 AI 润色后的对象
    }
  } catch (err) {
    console.error('AI生成失败:', err)
    ctx.status = 500
    ctx.body = { code: 500, message: 'AI生成题目出错' }
  }
}

aiQuestionRouter.post('/', getaiQuestion)
export default aiQuestionRouter
