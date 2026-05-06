import { UserService } from "../model/index.js";
import Router from '@koa/router'
import { sendSuccess, sendError } from '../type/index.js';
import bcrypt from 'bcrypt'

// 子路由：/api/user
const userRouter = new Router({ prefix: '/users' })


// 用户登录
userRouter.post('/login', async (ctx) => {
  try {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      return sendError(ctx, '用户名和密码不能为空');
    }

    const user = await UserService.findUserByUsername(username);

    if (!user) {
      return sendError(ctx, '用户不存在', 404);
    }

    // 密码校验(使用bcrypt进行加密)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(ctx, '密码错误', 401);
    }

    // 登录成功，剔除密码字段
    const { password: _, ...userInfo } = user;
    sendSuccess(ctx, userInfo, { message: '登录成功' });
  } catch (error) {
    sendError(ctx, '登录过程中发生错误: ' + error.message, 500);
  }
});

// 获取用户列表（仅管理员使用）
userRouter.get('/', async ctx => {
  try {
    const { page = 1, limit = 10, role, search } = ctx.query

    const pageNum = Math.max(1, Number(page))
    const pageSize = Math.max(1, Number(limit))

    const where = {}
    if (role) where.role = role
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { name: { contains: search } },
      ]
    }

    const { list, total } = await UserService.getAllUsers({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    })

    sendSuccess(ctx, list, {
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    sendError(ctx, '获取用户列表失败: ' + error.message, 500)
  }
});

// 获取用户详情（仅管理员使用）
userRouter.get('/:id', async ctx => {
  const { id } = ctx.params
  const userId = Number(id)

  if (isNaN(userId)) return sendError(ctx, '无效的用户ID')

  const user = await UserService.getUserById(userId)

  if (!user) {
    return sendError(ctx, '用户不存在', 404)
  }

  sendSuccess(ctx, user)
})

// 创建用户
userRouter.post('/', async ctx => {
  try {
    const body = ctx.request.body

    if (!body.username || !body.password) {
      return sendError(ctx, '用户名和密码为必填项')
    }

    // 检查用户名是否已存在
    const existing = await UserService.findUserByUsername(body.username)
    if (existing) {
      return sendError(ctx, '用户名已存在')
    }

    const newUser = await UserService.createUser(body)
    sendSuccess(ctx, newUser)
  } catch (error) {
    sendError(ctx, '创建用户失败: ' + error.message, 500)
  }
})

// 更新用户信息
userRouter.put('/:id', async ctx => {
  try {
    const { id } = ctx.params
    const userId = Number(id)

    if (isNaN(userId)) return sendError(ctx, '无效的用户ID')

    const updatedUser = await UserService.updateUser(userId, ctx.request.body)
    sendSuccess(ctx, updatedUser)
  } catch (error) {
    sendError(ctx, '更新用户信息失败: ' + error.message, 500)
  }
})

// 删除用户
userRouter.delete('/:id', async ctx => {
  try {
    const { id } = ctx.params
    const userId = Number(id)

    if (isNaN(userId)) return sendError(ctx, '无效的用户ID')

    await UserService.deleteUser(userId)
    sendSuccess(ctx, null, { message: '用户账号已注销' })
  } catch (error) {
    sendError(ctx, '删除用户失败: ' + error.message, 500)
  }
})

export default userRouter;