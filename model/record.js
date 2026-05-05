import prisma from '../prisma/index.js'

export const RecordService = {
  // 创建测评记录
  async createRecord({ studentId, score, totalScore, knowledgeUnit }) {
    return await prisma.quizRecord.create({
      data: {
        score: Number(score),
        totalScore: Number(totalScore),
        knowledgeUnit,
        studentId: Number(studentId),
      },
    })
  },

  // 更新学生总积分
  async updateStudentScore(studentId, score) {
    return await prisma.user.update({
      where: { id: Number(studentId) },
      data: {
        score: {
          increment: Number(score) || 0, // 在原积分基础上增加
        },
      },
    })
  },
}