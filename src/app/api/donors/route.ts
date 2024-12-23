import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const donors = await prisma.donor.findMany({
      include: {
        contact: true,
        donations: true,
      },
    })
    return NextResponse.json(donors)
  } catch (error) {
    console.error('Failed to fetch donors:', error)
    return NextResponse.json({ error: 'Failed to fetch donors' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contact, contactId, type, status, notes } = body

    let donorData: any = {
      type,
      status,
      notes,
    }

    if (contactId) {
      // Existing contact
      donorData.contact = { connect: { id: contactId } }
    } else if (contact) {
      // New contact
      donorData.contact = { create: contact }
    } else {
      throw new Error('Either contactId or contact information must be provided')
    }

    // Create donor
    const donor = await prisma.donor.create({
      data: donorData,
      include: {
        contact: true,
      },
    })

    return NextResponse.json(donor)
  } catch (error) {
    console.error('Failed to create donor:', error)
    return NextResponse.json({ error: 'Failed to create donor: ' + (error as Error).message }, { status: 500 })
  }
}

