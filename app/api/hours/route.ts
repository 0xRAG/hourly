import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { HourEntry } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const hourEntries = await prisma.hourEntry.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    })

    const directDbqHours = hourEntries
      .filter((entry: HourEntry) => entry.type === 'Direct' || entry.type === 'DBQ')
      .reduce((sum, entry) => sum + entry.hours, 0)
    
    const supervisionHours = hourEntries
      .filter((entry: HourEntry) => entry.type === 'Supervision')
      .reduce((sum, entry) => sum + entry.hours, 0)

    const totalHours = hourEntries.reduce((sum, entry) => sum + entry.hours, 0)

    return NextResponse.json({
      entries: hourEntries,
      totalHours,
      directDbqHours,
      supervisionHours,
      targetHours: user.targetHours,
      targetSupervisionHours: user.targetSupervisionHours || 0
    })
  } catch (error) {
    console.error('Get hours error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { date, hours, type, clientInitials } = body

    if (!date || !hours || !type) {
      return NextResponse.json(
        { error: 'Date, hours, and type are required' },
        { status: 400 }
      )
    }

    if (typeof hours !== 'number' || hours <= 0) {
      return NextResponse.json(
        { error: 'Hours must be a positive number' },
        { status: 400 }
      )
    }

    if (!['DBQ', 'Supervision', 'Direct', 'Consultation'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid hour type' },
        { status: 400 }
      )
    }

    // Parse date as local date to avoid timezone issues
    // When date is "2024-11-10", we want it to stay Nov 10 regardless of timezone
    const dateObj = new Date(date + 'T12:00:00')

    const hourEntry = await prisma.hourEntry.create({
      data: {
        date: dateObj,
        hours,
        type,
        clientInitials: clientInitials || null,
        userId: user.id
      }
    })

    return NextResponse.json(hourEntry)
  } catch (error) {
    console.error('Create hour entry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}