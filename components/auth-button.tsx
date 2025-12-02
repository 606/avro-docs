"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  LogOut, 
  User, 
  ChevronDown, 
  BookOpen, 
  Shield, 
  Users, 
  Settings,
  Github,
  Mail,
  Crown,
  UserCheck,
  UserX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AuthForm } from "@/components/auth-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getRoleBadge(appRole?: string, isPrivileged?: boolean) {
  if (isPrivileged || appRole === "admin") {
    return (
      <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-xs">
        <Crown className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
  }
  if (appRole === "member") {
    return (
      <Badge variant="secondary" className="text-xs">
        <UserCheck className="h-3 w-3 mr-1" />
        Member
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-xs">
      <UserX className="h-3 w-3 mr-1" />
      Guest
    </Badge>
  );
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "U";
}

export function AuthButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
      </Button>
    );
  }

  if (session) {
    const user = session.user;
    const appRole = user?.appRole;
    const isPrivileged = user?.isPrivileged;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 h-9 px-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
              <AvatarFallback className="text-xs">
                {getInitials(user?.name, user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium max-w-[100px] truncate">
                {user?.login || user?.name || "User"}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {/* User Info Header */}
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                <AvatarFallback>
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">
                  {user?.login || user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
                <div className="pt-1">
                  {getRoleBadge(appRole, isPrivileged)}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* Organization Info */}
          {user?.orgs && user.orgs.length > 0 && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-1.5">
                  Organizations
                </DropdownMenuLabel>
                {user.orgs.map((org) => (
                  <DropdownMenuItem key={org.login} className="px-3" disabled>
                    <Users className="mr-2 h-4 w-4" />
                    <span className="flex-1">{org.login}</span>
                    <Badge 
                      variant={org.role === "admin" ? "default" : "secondary"} 
                      className="text-xs ml-2"
                    >
                      {org.role}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Provider Info */}
          <DropdownMenuGroup>
            <DropdownMenuItem disabled className="px-3">
              <Github className="mr-2 h-4 w-4" />
              <span className="text-muted-foreground">Connected via GitHub</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          {/* Actions */}
          <DropdownMenuItem 
            onClick={() => signOut()}
            className="px-3 text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Welcome back
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access Avro Documentation
          </DialogDescription>
        </DialogHeader>
        <AuthForm className="mt-4" />
      </DialogContent>
    </Dialog>
  );
}