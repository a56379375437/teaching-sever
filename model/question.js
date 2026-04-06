import prisma from '../prisma/index.js'
import { QUESTION_INCLUDE } from '../type/index.js'

export const QuestionService = {
  // 获取所有问题
  async getAllQuestions({ where = {}, skip, take }) {
    const [list, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip: skip ? Number(skip) : undefined,
        take: take ? Number(take) : undefined,
        orderBy: { id: 'desc' },
        include: QUESTION_INCLUDE,
      }),
      prisma.question.count({ where }),
    ])
    return { list, total }
  },

  // 获取单个问题
  async getQuestionById(id) {
    return await prisma.question.findUnique({
      where: { id: Number(id) },
      include: QUESTION_INCLUDE,
    })
  },

  // 创建问题
  async createQuestion(data) {
    const {
      title,
      type,
      level,
      knowledgeUnit,
      score,
      creator,
      options,
      answer,
    } = data

    return await prisma.question.create({
      data: {
        title,
        type,
        level,
        knowledgeUnit,
        score: score ? Number(score) : 5,
        creator,
        // 映射选项
        options: {
          create: (options || []).map(opt => ({
            content: opt.content,
            isCorrect: !!opt.isCorrect,
          })),
        },
        // 处理不同题型的关联表数据
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
      include: QUESTION_INCLUDE,
    })
  },

  // 更新问题
  async updateQuestion(id, data) {
    const { title, type, level, knowledgeUnit, score, options, answer } = data

    const questionId = Number(id)

    return await prisma.question.update({
      where: { id: questionId },
      data: {
        title,
        type,
        level,
        knowledgeUnit,
        score: score ? Number(score) : undefined,
        // 选项更新：先删除后重新创建（覆盖式更新）
        options: options
          ? {
              deleteMany: {},
              create: options.map(opt => ({
                content: opt.content,
                isCorrect: !!opt.isCorrect,
              })),
            }
          : undefined,
        // 更新特定题型的详情内容
        ...(type === 'JUDGMENT' && {
          judgment: { upsert: { create: { answer }, update: { answer } } },
        }),
        ...(type === 'FILL_BLANK' && {
          fillBlank: {
            upsert: {
              create: { standardAnswer: answer },
              update: { standardAnswer: answer },
            },
          },
        }),
        ...(type === 'CALCULATION' && {
          calculation: {
            upsert: {
              create: { standardAnswer: answer },
              update: { standardAnswer: answer },
            },
          },
        }),
        ...(type === 'SHORT_ANSWER' && {
          shortAnswer: {
            upsert: {
              create: { standardAnswer: answer },
              update: { standardAnswer: answer },
            },
          },
        }),
      },
      include: QUESTION_INCLUDE,
    })
  },

  // 删除问题
  async deleteQuestion(id) {
    return await prisma.question.delete({
      where: { id: Number(id) },
    })
  },
}
