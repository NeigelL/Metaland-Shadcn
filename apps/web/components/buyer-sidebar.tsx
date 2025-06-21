"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LandPlot, TreePine, File, User, Home, LogOut, ChevronUp, Users, PhilippinePeso, LibraryBig, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image  from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";


import { useUserStore } from "@/stores/useUserStore";
import LoggedInUser from "./LoggedInUser/LoggedInUser";

// Define types for menu items
type MenuItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
} | {
  title: string;
  isActive?: boolean;
  icon?: any;
  submenu?: {
    title: string;
    url: string;
    icon?: any;
  }[];
};

const items: MenuItem[] = [
    {
    title: "BUYER",
    submenu: [
      { title: "DASHBOARD", url: "/", icon: <Home size={14} /> },
      { title: "LOTS", url: "/lots", icon: <LandPlot size={14} /> },
    ]
  }
]



export function BuyerAppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activePath, setActivePath] = useState(pathname);
  const [mounted, setMounted] = useState(false);
  const { user, clearUser } = useUserStore();
  useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    clearUser();
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <Sidebar className="flex flex-col justify-between h-screen w-64">
      <SidebarContent className="relative">
        <div className="flex flex-col items-center">
          <Image src="/images/metaland.png" alt="Logo" width={250} height={250} />
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
                          {'submenu' in item && item.submenu && item?.submenu.map((subItem) => {
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
     <LoggedInUser/>
    </Sidebar>
  );
}