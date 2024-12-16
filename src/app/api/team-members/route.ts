import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const teamMembers = await prisma.teamMember.findMany();
    return NextResponse.json(teamMembers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const teamMember = await prisma.teamMember.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}

