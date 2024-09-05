import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentTasksNotifications() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">New donor: Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            Donated $1,999.00
          </p>
        </div>
        <div className="ml-auto font-medium">Just now</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Donation goal achieved</p>
          <p className="text-sm text-muted-foreground">
            Summer Campaign reached $50,000
          </p>
        </div>
        <div className="ml-auto font-medium">2h ago</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Order status update</p>
          <p className="text-sm text-muted-foreground">
            Order #1234 has been shipped
          </p>
        </div>
        <div className="ml-auto font-medium">5h ago</div>
      </div>
    </div>
  )
}