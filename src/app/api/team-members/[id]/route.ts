import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id },
    });
    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    return NextResponse.json(teamMember);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const teamMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        name: data.name,
        email: data.email,
      },
    });
    return NextResponse.json(teamMember);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.task.deleteMany({
      where: { assigneeId: params.id },
    });

    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Team member and associated tasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member. They may have associated tasks.' }, { status: 500 });
  }
}

