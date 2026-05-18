// server/prisma/seed.js

import bcrypt from 'bcrypt'
import Mock from 'mockjs'
import prisma from './index.js'

async function main() {
  console.log('开始填充数据...')

  // 生成一个通用的加密密码 (明文为 123456)
  const hashedPassword = await bcrypt.hash('123456', 10)

  const users = []

  // 生成 100 条学生数据
  for (let i = 0; i < 100; i++) {
    const data = Mock.mock({
      username: /^[a-z]{5,8}\d{3}$/, // 生成随机账号如: xykzf123
      name: '@cname', // 生成随机中文名
      score: '@integer(0, 500)', // 随机积分
    })

    users.push({
      username: data.username,
      name: data.name,
      password: hashedPassword,
      role: 'STUDENT',
      score: data.score,
    })
  }

  // 生成 20 条教师数据
  for (let i = 0; i < 20; i++) {
    users.push({
      username: `teacher_${Mock.Random.string('lower', 4)}${i}`,
      name: Mock.Random.cname(),
      password: hashedPassword,
      role: 'TEACHER',
      score: 0,
    })
  }

  // 写入数据库
  console.log(`正在写入 ${users.length} 条数据，请稍候...`)

  let successCount = 0
  for (const user of users) {
    try {
      await prisma.user.upsert({
        where: { username: user.username },
        update: {}, // 如果账号已存在，不执行任何操作
        create: user,
      })
      successCount++
    } catch (err) {
      console.error(`写入用户 ${user.username} 失败:`, err.message)
    }
  }

  console.log(`填充完成！成功写入 ${successCount} 条数据。`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
