import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const totalDonations = await prisma.donation.aggregate({
      _sum: {
        amount: true
      },
      where: {
        date: {
          gte: thirtyDaysAgo
        }
      }
    })

    const previousMonthDonations = await prisma.donation.aggregate({
      _sum: {
        amount: true
      },
      where: {
        date: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lt: thirtyDaysAgo
        }
      }
    })

    const currentTotal = totalDonations._sum.amount?.toNumber() || 0
    const previousTotal = previousMonthDonations._sum.amount?.toNumber() || 0

    const percentageIncrease = previousTotal > 0
      ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      totalDonations: currentTotal,
      percentageIncrease
    })
  } catch (error) {
    console.error('Failed to fetch total donations:', error)
    return NextResponse.json({ error: 'Failed to fetch total donations' }, { status: 500 })
  }
}

