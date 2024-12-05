import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid input: ids must be a non-empty array' }, { status: 400 });
    }

    const result = await prisma.contact.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ message: `${result.count} contacts deleted successfully`, count: result.count }, { status: 200 });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json({ error: 'Failed to delete contacts' }, { status: 500 });
  }
}

