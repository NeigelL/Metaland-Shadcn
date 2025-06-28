"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LandPlot, TreePine, File, User, Home, LogOut, ChevronUp, Users, PhilippinePeso, LibraryBig } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image  from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import ImageLogo from "./ImageLogo";

// Define types for menu items
type MenuItem = {
  title: string;
  url: string;
  icon: React.ReactElement;
} | {
  title: string;
  submenu: {
    title: string;
    url: string;
    icon: React.ReactElement;
  }[];
};

const items: MenuItem[] = [
    {
    title: "AGENT",
    submenu: [
      { title: "DASHBOARD", url: "/agentdashboard", icon: <Home size={14} /> },
      { title: "CLIENTS", url: "/agentclients", icon: <Users size={14} /> },
      { title: "LOTS", url: "/agentlots", icon: <LandPlot size={14} /> },
      { title: "PROJECTS", url: "/agentproject", icon: <TreePine size={14} /> },
      { title: "EARNINGS", url: "/agentearnings", icon: <PhilippinePeso size={14} /> },
      { title: "MATERIALS", url: "/agentmaterials", icon: <LibraryBig size={14} /> },
      { title: "DOCUMENTS", url: "/agentdocuments", icon: <File size={14} /> },
    ],
  },
  {
    title: "BUYER",
    submenu: [
      { title: "DASHBOARD", url: "/buyerdashboard", icon: <Home size={14} /> },
      { title: "LOTS", url: "/buyerlots", icon: <LandPlot size={14} /> },
      { title: "PROJECTS", url: "/buyerproject", icon: <TreePine size={14} /> },
      { title: "DOCUMENTS", url: "/buyerdocuments", icon: <File size={14} /> },
    ]
  }
  
];

export default function AgentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activePath, setActivePath] = useState(pathname);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname]);
  
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not signed in.</p>;
  }

  const handleLogout = async () => {
    await signOut();
  };

  if (!mounted) return null; 

  return (
    <Sidebar className="flex flex-col justify-between h-screen w-64"> 
      <SidebarContent className="relative"> 
        <div className="flex flex-col items-center">
            <ImageLogo/>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Check if item has submenu
                const hasSubmenu = 'submenu' in item;
                const isActive = !hasSubmenu && 'url' in item && activePath === item.url;
                
                return (
                  <div key={item.title}>
                    {hasSubmenu ? (
                      // Menu header (non-clickable)
                      <>
                        <SidebarMenuItem>
                          <div className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 font-medium">
                            <span className="text-xs">{item.title}</span>
                          </div>
                        </SidebarMenuItem>
                        
                        {/* Always show submenu items */}
                        <div className="ml-4 space-y-1">
                          {'submenu' in item && item.submenu.map((subItem) => {
                            const isSubActive = activePath === subItem.url;
                            return (
                              <SidebarMenuItem key={subItem.title}>
                                <SidebarMenuButton asChild>
                                  <Link 
                                    href={subItem.url} 
                                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors
                                      ${isSubActive ? "bg-gray-200 text-gray-900 font-semibold" : "hover:bg-gray-100 text-gray-600"}`}
                                  >
                                    <div className={`w-4 ${isSubActive ? "text-gray-900" : "text-gray-500"}`}>{subItem.icon}</div>
                                    <span className="text-xs">{subItem.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      // Regular menu item
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href={'url' in item ? item.url : '#'} className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors 
                              ${isActive ? "bg-gray-200 text-gray-900 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>
                            <div className={`w-5 ${isActive ? "text-gray-900" : "text-gray-600"}`}>{'url' in item ? item.icon : null}</div>
                            <span className="text-xs">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Dropdown */}
      <div className="border-t border-gray-200 p-4 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center w-full gap-2 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 w-full overflow-hidden">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 uppercase font-semibold">
                  {session.user?.image ? (
                    <Image
                      src={session.user?.image}
                      alt={session.user?.name || "User Avatar"}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    session.user?.name
                      ? session.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : <User size={16} />
                  )}
                </div>
                <div className="flex flex-col items-start text-left overflow-hidden w-full">
                  <span className="text-sm font-medium truncate w-full">{session.user?.name}</span>
                  <span className="text-xs text-gray-500 truncate w-full">{session.user?.email}</span>
                </div>
              </div>
              <ChevronUp className="ml-auto" size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 absolute left-0 bottom-0" align="start" side="top">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer">
                <User className="mr-2" size={16} />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2" size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
}