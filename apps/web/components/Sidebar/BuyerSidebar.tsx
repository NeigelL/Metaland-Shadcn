"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LandPlot, LucideIcon, HomeIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";


import { useUserStore } from "@/stores/useUserStore";
import LoggedInUser from "../LoggedInUser/LoggedInUser";
import ImageLogo from "./ImageLogo";
import NavMain from "./nav-main";

// Define types for menu items
type MenuItem = {
    title: string,
    title_show?: boolean
    url?: string,
    icon?: LucideIcon,
    isActive?: boolean,
    items?: {
        title: string,
        url: string,
        icon?: LucideIcon
    }[]
}


const items: MenuItem[] = [
    // {
      // title: "MENU",
      // url: "/",
      // items: [
      //   { title: "DASHBOARD", url: "/", icon: HomeIcon },
      //   { title: "LOTS", url: "/lots", icon: LandPlotIcon },
      // ]
    // },
    {
      title: "DASHBOARD",
      url: "/",
      icon: HomeIcon,
    },
     {
      title: "MY LOTS",
      url: "/lots",
      icon: LandPlot,
    }
]



export default function BuyerSidebar() {
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
    <Sidebar collapsible="icon" className="flex flex-col justify-between h-screen w-64">
      <SidebarHeader className="flex items-center justify-between p-4">
        <ImageLogo/>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
          <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter className="p-4">
      </SidebarFooter>
      <SidebarRail className="flex flex-col"/>
     {/* <LoggedInUser/> */}
    </Sidebar>
  );
}