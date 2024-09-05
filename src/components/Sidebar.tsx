"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  ShoppingCart, 
  Gift, 
  Package, 
  BarChart, 
  CheckSquare, 
  Settings 
} from "lucide-react";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Contacts",
    icon: Users,
    href: "/contacts",
  },
  {
    label: "Campaigns",
    icon: Mail,
    href: "/campaigns",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    label: "Donations",
    icon: Gift,
    href: "/donations",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
  },
  {
    label: "Reports",
    icon: BarChart,
    href: "/reports",
  },
  {
    label: "Task Management",
    icon: CheckSquare,
    href: "/tasks",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="px-6 py-8">
        <Link href="/dashboard" className="flex items-center mb-12">
          <div className="relative w-12 h-12 mr-4">
            <Image fill alt="Logo" src="/logo.png" className="rounded-xl" />
          </div>
          <h1 className={cn("text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400", montserrat.className)}>
            CRM Software
          </h1>
        </Link>
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group relative overflow-hidden",
                pathname === route.href
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                  : "hover:bg-gray-800/50"
              )}
            >
              <route.icon className={cn(
                "h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110",
                pathname === route.href ? "text-white" : "text-gray-400 group-hover:text-white"
              )} />
              <span className={cn(
                "text-sm font-medium transition-colors duration-200",
                pathname === route.href
                  ? "font-semibold"
                  : "text-gray-300 group-hover:text-white"
              )}>
                {route.label}
              </span>
              {pathname === route.href && (
                <span className="absolute inset-y-0 left-0 w-1 bg-blue-400 rounded-r-full" aria-hidden="true" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}