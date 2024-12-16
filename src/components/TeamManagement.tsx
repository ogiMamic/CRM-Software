"use client"

import React, { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast, Toaster } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type TeamMember = {
  id: string
  name: string
  email: string
}

export function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null)
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    email: '',
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members')
      if (!response.ok) {
        throw new Error('Failed to fetch team members')
      }
      const data = await response.json()
      setTeamMembers(data)
    } catch (error) {
      console.error('Error fetching team members:', error)
      toast.error('Failed to load team members. Please try again.')
    }
  }

  const columns: ColumnDef<TeamMember>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleEditMember(member)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit member</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete member</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the team member
                    and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  const handleAddMember = async () => {
    try {
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      })
      if (!response.ok) {
        throw new Error('Failed to add team member')
      }
      await fetchTeamMembers()
      setIsAddMemberOpen(false)
      resetNewMember()
      toast.success('Team member added successfully!')
    } catch (error) {
      console.error('Error adding team member:', error)
      toast.error('Failed to add team member. Please try again.')
    }
  }

  const handleEditMember = (member: TeamMember) => {
    setCurrentMember(member)
    setNewMember({ name: member.name, email: member.email })
    setIsEditMemberOpen(true)
  }

  const handleUpdateMember = async () => {
    if (!currentMember) return
    try {
      const response = await fetch(`/api/team-members/${currentMember.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      })
      if (!response.ok) {
        throw new Error('Failed to update team member')
      }
      await fetchTeamMembers()
      setIsEditMemberOpen(false)
      resetNewMember()
      toast.success('Team member updated successfully!')
    } catch (error) {
      console.error('Error updating team member:', error)
      toast.error('Failed to update team member. Please try again.')
    }
  }

  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete team member');
      }
      await fetchTeamMembers();
      toast.success('Team member deleted successfully!');
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete team member. Please try again.');
    }
  };

  const resetNewMember = () => {
    setNewMember({
      name: '',
      email: '',
    })
    setCurrentMember(null)
  }

  return (
    <Card className="w-full">
      <Toaster position="top-right" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Team Management</CardTitle>
        <Dialog open={isAddMemberOpen} onOpenChange={(open) => {
          setIsAddMemberOpen(open)
          if (open) resetNewMember()
        }}>
          <DialogTrigger asChild>
            <Button>Add Team Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <TeamMemberForm member={newMember} setMember={setNewMember} onSubmit={handleAddMember} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={teamMembers} />
      </CardContent>
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <TeamMemberForm member={newMember} setMember={setNewMember} onSubmit={handleUpdateMember} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

type TeamMemberFormProps = {
  member: Omit<TeamMember, 'id'>
  setMember: React.Dispatch<React.SetStateAction<Omit<TeamMember, 'id'>>>
  onSubmit: () => void
}

function TeamMemberForm({ member, setMember, onSubmit }: TeamMemberFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="name" className="text-right">
          Name
        </label>
        <Input
          id="name"
          value={member.name}
          onChange={(e) => setMember({...member, name: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="email" className="text-right">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={member.email}
          onChange={(e) => setMember({...member, email: e.target.value})}
          className="col-span-3"
        />
      </div>
      <Button onClick={onSubmit} className="ml-auto">Submit</Button>
    </div>
  )
}

export default TeamManagement;

