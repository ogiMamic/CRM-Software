import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const contacts = await request.json()

    const createdContacts = await prisma.$transaction(async (tx) => {
      let createdCount = 0;
      for (const contact of contacts) {
        const existingContact = await tx.contact.findFirst({
          where: {
            email: contact.email
          }
        });

        if (!existingContact) {
          await tx.contact.create({
            data: contact
          });
          createdCount++;
        }
      }
      return createdCount;
    });

    return NextResponse.json({ message: `Imported ${createdContacts} contacts successfully`, count: createdContacts }, { status: 200 })
  } catch (error) {
    console.error('Error importing contacts:', error)
    return NextResponse.json({ error: 'Failed to import contacts' }, { status: 500 })
  }
}