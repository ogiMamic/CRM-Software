import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

type Role = {
  id: string
  name: string
  permissions: {
    [key: string]: boolean
  }
}

const initialRoles: Role[] = [
  { id: '1', name: 'Admin', permissions: { viewReports: true, editReports: true, manageUsers: true, manageSettings: true } },
  { id: '2', name: 'Editor', permissions: { viewReports: true, editReports: true, manageUsers: false, manageSettings: false } },
  { id: '3', name: 'Marketer', permissions: { viewReports: true, editReports: false, manageUsers: false, manageSettings: false } },
  { id: '4', name: 'Viewer', permissions: { viewReports: true, editReports: false, manageUsers: false, manageSettings: false } },
]

export function UserRolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [newRole, setNewRole] = useState<Role>({ id: '', name: '', permissions: {} })
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)

  const handlePermissionChange = (roleId: string, permission: string) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, [permission]: !role.permissions[permission] } }
        : role
    ))
  }

  const handleAddRole = () => {
    if (newRole.name) {
      setRoles([...roles, { ...newRole, id: (roles.length + 1).toString() }])
      setIsAddRoleOpen(false)
      setNewRole({ id: '', name: '', permissions: {} })
      toast.success('New role added successfully!')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>User Roles and Permissions</span>
          <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
            <DialogTrigger asChild>
              <Button>Add New Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="roleName" className="text-right">Role Name</Label>
                  <Input
                    id="roleName"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                {Object.keys(initialRoles[0].permissions).map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`newRole-${permission}`}
                      checked={newRole.permissions[permission] || false}
                      onCheckedChange={(checked) => 
                        setNewRole({...newRole, permissions: {...newRole.permissions, [permission]: checked}})
                      }
                    />
                    <Label htmlFor={`newRole-${permission}`}>{permission}</Label>
                  </div>
                ))}
              </div>
              <Button onClick={handleAddRole}>Add Role</Button>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              {Object.keys(initialRoles[0].permissions).map(permission => (
                <TableHead key={permission}>{permission}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                {Object.entries(role.permissions).map(([permission, value]) => (
                  <TableCell key={permission}>
                    <Checkbox
                      checked={value}
                      onCheckedChange={() => handlePermissionChange(role.id, permission)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}