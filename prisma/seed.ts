import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding process...')

  // Seed team members
  const teamMembers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' },
    { name: 'Alice Williams', email: 'alice@example.com' },
  ]

  console.log('Seeding team members...')
  for (const member of teamMembers) {
    const createdMember = await prisma.teamMember.upsert({
      where: { email: member.email }, // Proverava da li već postoji član sa istim emailom
      update: {}, // Ako već postoji, ništa se ne menja
      create: member, // Ako ne postoji, kreira novog člana
    })
    console.log(`Created or found team member: ${createdMember.name}`)
  }

  // Fetch created team members to use their IDs for tasks
  const createdMembers = await prisma.teamMember.findMany()

  // Seed tasks
  const tasks = [
    { title: 'Develop new feature', status: 'In Progress', assigneeId: createdMembers[0].id, dueDate: new Date('2024-12-31') },
    { title: 'Fix critical bug', status: 'To Do', assigneeId: createdMembers[1].id, dueDate: new Date('2024-12-25') },
    { title: 'Write documentation', status: 'Completed', assigneeId: createdMembers[2].id, dueDate: new Date('2023-12-20') },
    { title: 'Refactor codebase', status: 'In Progress', assigneeId: createdMembers[3].id, dueDate: new Date('2025-01-15') },
    { title: 'Implement user feedback', status: 'To Do', assigneeId: createdMembers[0].id, dueDate: new Date('2025-01-10') },
  ]

  console.log('Seeding tasks...')
  for (const task of tasks) {
    const createdTask = await prisma.task.upsert({
      where: { id: task.assigneeId }, // Ovdje koristimo assigneeId za proveru
      update: {}, // Ako zadatak postoji, ništa se ne menja
      create: task, // Ako zadatak ne postoji, kreiraj ga
    })
    console.log(`Created or found task: ${createdTask.title}`)
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
