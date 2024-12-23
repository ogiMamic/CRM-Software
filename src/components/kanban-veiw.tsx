import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Task } from "@/types/task"

type KanbanViewProps = {
  tasks: Task[]
  onDragEnd: (result: any) => void
}

export function KanbanView({ tasks, onDragEnd }: KanbanViewProps) {
  const columns = ['To Do', 'In Progress', 'Completed']

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <Card>
                <CardHeader>
                  <CardTitle>{column}</CardTitle>
                </CardHeader>
                <CardContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  {tasks
                    .filter((task) => task.status === column)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 p-2"
                          >
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-gray-500">
                              Assignee: {task.assignee.name}
                            </p>
                            {task.dueDate && (
                              <p className="text-sm text-gray-500">
                                Due: {format(new Date(task.dueDate), "PPP")}
                              </p>
                            )}
                            <Badge
                              variant={
                                task.status === 'Completed'
                                  ? 'success'
                                  : task.status === 'In Progress'
                                  ? 'warning'
                                  : 'default'
                              }
                            >
                              {task.status}
                            </Badge>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}

