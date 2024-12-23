export type Task = {
    id: string
    title: string
    status: 'To Do' | 'In Progress' | 'Completed'
    assigneeId: string
    assignee: {
      id: string
      name: string
    }
    dueDate: Date | null
  }
  
  