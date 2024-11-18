import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch a campaign by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: Number(params.id) },
        });
        return campaign
            ? NextResponse.json(campaign)
            : NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
    }
}

// PATCH: Update a campaign by ID
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data = await request.json();
        const updatedCampaign = await prisma.campaign.update({
            where: { id: Number(params.id) },
            data,
        });
        return NextResponse.json(updatedCampaign);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }
}

// DELETE: Delete a campaign by ID
export async function DELETE({ params }: { params: { id: string } }) {
    try {
        await prisma.campaign.delete({
            where: { id: Number(params.id) },
        });
        return NextResponse.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
    }
}
