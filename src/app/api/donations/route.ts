import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        donor: {
          include: {
            contact: true,
          },
        },
      },
    })
    return NextResponse.json(donations)
  } catch (error) {
    console.error('Failed to fetch donations:', error)
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency, type, status, donorId, date, campaign, notes } = body

    const donation = await prisma.donation.create({
      data: {
        amount,
        currency: currency || 'USD',
        type,
        status: status || 'Completed',
        donorId,
        date: new Date(date),
        campaign,
        notes,
      },
      include: {
        donor: {
          include: {
            contact: true,
          },
        },
      },
    })

    return NextResponse.json(donation)
  } catch (error) {
    console.error('Failed to create donation:', error)
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 })
  }
}

