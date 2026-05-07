// 定义数据库中的枚举，因为js不支持枚举，故使用对象模拟枚举
// 题目类型枚举
export const QuestionType = {
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  JUDGMENT: 'JUDGMENT',
  FILL_BLANK: 'FILL_BLANK',
  CALCULATION: 'CALCULATION',
  SHORT_ANSWER: 'SHORT_ANSWER',
}
//难度等级
export const QuestionLevel = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
}
// 知识点分类
export const KnowledgeUnit = {
  LARGE_NUMBER_LAW: 'LARGE_NUMBER_LAW',
  CENTRAL_LIMIT_THEOREM: 'CENTRAL_LIMIT_THEOREM',
}

// 提取公共的 include 配置，减少冗余(主要用于获取题目列表时)
export const QUESTION_INCLUDE = {
  options: true,
  creator: true,
  singleChoice: true,
  multipleChoice: true,
  judgment: true,
  fillBlank: true,
  calculation: true,
  shortAnswer: true,
}

// 辅助函数：统一成功响应格式
export const sendSuccess = (ctx, data, extra = {}) => {
  ctx.body = { success: true, data, ...extra };
};

// 辅助函数：统一错误响应格式
export const sendError = (ctx, message, status = 400) => {
  ctx.status = status;
  ctx.body = { success: false, message };
};