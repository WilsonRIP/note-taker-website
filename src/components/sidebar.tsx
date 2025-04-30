"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "../lib/utils";
import {
  BookText,
  FolderPlus,
  Home,
  List,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { useTheme } from "./theme-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "All Notes",
      href: "/notes",
      icon: BookText,
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold">Note Taker</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", isCollapsed && "mx-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <List className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href &&
                      "bg-accent text-accent-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>

        <Button
          variant="default"
          className={cn(
            "mt-2 flex items-center gap-2",
            isCollapsed && "justify-center px-0 min-w-0"
          )}
          onClick={() => {
            // Will implement new note creation logic
          }}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>New Note</span>}
        </Button>
      </nav>
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className={cn(isCollapsed ? "mx-auto" : "ml-auto")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
