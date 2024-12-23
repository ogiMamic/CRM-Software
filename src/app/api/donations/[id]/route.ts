import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updatedDonation)
  } catch (error) {
    console.error('Failed to update donation:', error)
    return NextResponse.json({ error: 'Failed to update donation' }, { status: 500 })
  }
}

