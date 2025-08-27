import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      )
    }

    // First, check if the entry exists and belongs to the current user
    const existingEntry = await prisma.hourEntry.findUnique({
      where: { id },
      select: { id: true, userId: true }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Hour entry not found' },
        { status: 404 }
      )
    }

    if (existingEntry.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this entry' },
        { status: 403 }
      )
    }

    // Delete the entry
    await prisma.hourEntry.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Entry deleted successfully' })
  } catch (error) {
    console.error('Delete hour entry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}