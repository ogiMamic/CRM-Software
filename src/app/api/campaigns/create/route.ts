import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const newCampaign = await prisma.campaign.create({
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                comments: Number(data.comments)
            }
        });
        
        return NextResponse.json(newCampaign, { status: 201 });
    } catch (error) {
        console.error("Error creating campaign:", error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}