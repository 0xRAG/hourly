import { NextRequest, NextResponse } from 'next/server'
import { createUser, signToken } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, username, password, workplaceName, supervisorName, targetHours, targetSupervisionHours } = body

    if (!name || !username || !password || !workplaceName || !supervisorName || !targetHours || !targetSupervisionHours) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (typeof targetHours !== 'number' || targetHours <= 0) {
      return NextResponse.json(
        { error: 'Target hours must be a positive number' },
        { status: 400 }
      )
    }

    if (typeof targetSupervisionHours !== 'number' || targetSupervisionHours <= 0) {
      return NextResponse.json(
        { error: 'Target supervision hours must be a positive number' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    const user = await createUser({
      name,
      username,
      password,
      workplaceName,
      supervisorName,
      targetHours,
      targetSupervisionHours
    })

    const token = signToken(user.id)

    const response = NextResponse.json({ user })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}