import React, { useState } from 'react';
import { Home, Users, LogOut, ChevronUp, ClipboardList, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import UserManagement from './UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from './UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from './mode-toggle';
import CategoryServiceManagement from './CategoryServiceManagement';

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "User Management",
    icon: Users,
  },
  {
    title: "Deleted Changes",
    url: "/deleted",
    icon: Trash2,
  },
  {
    title: "Categories",
    icon: Settings,
  },
];

interface AppSidebarProps {
  onUserAdded: () => Promise<void>;
}

export function AppSidebar({ onUserAdded }: AppSidebarProps) {
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isCategoryServiceManagementOpen, setIsCategoryServiceManagementOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-2 py-1">
              <ClipboardList className="h-6 w-6" />
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold leading-none">Change Tracker</span>
                <span className="text-xs text-muted-foreground leading-none">Track your changes</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <Separator className="my-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "User Management" ? (
                    <SidebarMenuButton onClick={() => setIsUserManagementOpen(true)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : item.title === "Category & Service Management" ? (
                    <SidebarMenuButton onClick={() => setIsCategoryServiceManagementOpen(true)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-2 flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <div className="flex items-center gap-2">
                  {user && <UserAvatar username={user.username} size="sm" />}
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Logged in user
                    </p>
                  </div>
                </div>
                <ChevronUp className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              alignOffset={11}
              className="w-[200px]"
              forceMount
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </SidebarFooter>

      <UserManagement
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />
      <CategoryServiceManagement
        isOpen={isCategoryServiceManagementOpen}
        onClose={() => setIsCategoryServiceManagementOpen(false)}
      />
    </Sidebar>
  );
}
