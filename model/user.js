import prisma from '../prisma/index.js'

export const UserService = {
  // 根据用户名查找（登录用）
  async findUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username }
    });
  },

  // 获取用户列表
  async getAllUsers({ where, skip, take }) {
    const [list, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' },
        select: { // 列表通常不返回密码
          id: true,
          username: true,
          name: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.user.count({ where })
    ]);
    return { list, total };
  },

  // 获取单个用户详情
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        quizRecords: true // 可以顺带查出学生的测评记录
      }
    });
  },

  // 创建用户
  async createUser(data) {
    return await prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        name: data.name,
        role: data.role || 'STUDENT'
      }
    });
  },

  // 更新用户
  async updateUser(id, data) {
    return await prisma.user.update({
      where: { id },
      data: {
        password: data.password,
        name: data.name,
        role: data.role
      }
    });
  },

  // 删除用户
  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id }
    });
  },

  // 增加积分（主要用于学生测评）
  async updateUserScore(userId, points) {
    return await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        score: {
          increment: Number(points) // 使用 Prisma 的原子自增功能
        }
      }
    });
  },


};