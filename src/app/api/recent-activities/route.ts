import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type DonationActivity = {
  type: 'donation'
  name: string
  amount: number
  date: Date
}

type TaskActivity = {
  type: 'task'
  title: string
  status: string
  assignee: string
  dueDate: Date | null
}

type Activity = DonationActivity | TaskActivity

function isDonationActivity(activity: Activity): activity is DonationActivity {
  return activity.type === 'donation'
}

export async function GET() {
  try {
    const [recentDonations, recentTasks] = await Promise.all([
      prisma.donation.findMany({
        take: 3,
        orderBy: { date: 'desc' },
        include: {
          donor: {
            include: {
              contact: true
            }
          }
        }
      }),
      prisma.task.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        where: { 
          status: {
            not: 'Completed'
          }
        },
        include: {
          assignee: true
        }
      })
    ])

    const activities: Activity[] = [
      ...recentDonations.map(donation => ({
        type: 'donation' as const,
        name: donation.donor.contact.name,
        amount: donation.amount.toNumber(),
        date: donation.date
      })),
      ...recentTasks.map(task => ({
        type: 'task' as const,
        title: task.title,
        status: task.status,
        assignee: task.assignee.name,
        dueDate: task.dueDate
      }))
    ].sort((a, b) => {
      const dateA = isDonationActivity(a) ? a.date : (a.dueDate || new Date(0));
      const dateB = isDonationActivity(b) ? b.date : (b.dueDate || new Date(0));
      return dateB.getTime() - dateA.getTime();
    })

    return NextResponse.json(activities.slice(0, 3))
  } catch (error) {
    console.error('Failed to fetch recent activities:', error)
    return NextResponse.json({ error: 'Failed to fetch recent activities' }, { status: 500 })
  }
}

