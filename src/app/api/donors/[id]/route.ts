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

    const updatedDonor = await prisma.donor.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updatedDonor)
  } catch (error) {
    console.error('Failed to update donor:', error)
    return NextResponse.json({ error: 'Failed to update donor' }, { status: 500 })
  }
}

