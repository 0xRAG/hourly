import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    return null
  }

  const payload = verifyToken(token.value)
  if (!payload) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        username: true,
        workplaceName: true,
        supervisorName: true,
        targetHours: true,
        targetSupervisionHours: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}