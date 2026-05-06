import prisma from '../prisma/index.js'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;//加密次数

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
          score: true,
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
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);//加密
    return await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'STUDENT'
      }
    });
  },

  // 更新用户
  async updateUser(id, data) {
    const updateData = {
      name: data.name,
      role: data.role,
      score: data.score || undefined ? Number(data.score) : undefined // 不传默认为undefined，表示不更新
    };

    if(data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    return await prisma.user.update({
      where: { id: Number(id) },
      data: updateData
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