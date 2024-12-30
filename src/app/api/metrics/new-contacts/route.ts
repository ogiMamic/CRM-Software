import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const newContactsCount = await prisma.contact.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const totalContactsCount = await prisma.contact.count()

    const percentageIncrease = totalContactsCount > 0
      ? ((newContactsCount / totalContactsCount) * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      newContacts: newContactsCount,
      percentageIncrease
    })
  } catch (error) {
    console.error('Failed to fetch new contacts count:', error)
    return NextResponse.json({ error: 'Failed to fetch new contacts count' }, { status: 500 })
  }
}

