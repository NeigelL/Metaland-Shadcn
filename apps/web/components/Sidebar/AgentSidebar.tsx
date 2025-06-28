"use client";

import { LandPlot, LucideIcon, HomeIcon, Users, TreePine, PhilippinePeso, LibraryBig, File } from "lucide-react";
import NavSidebar from "./nav-sidebar";

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
    {
      title: "DASHBOARD",
      url: "/",
      icon: HomeIcon,
    },
     {
      title: "MY LOTS",
      url: "/lots",
      icon: LandPlot,
    },
    {
      title: "CLIENTS",
      url: "/clients",
      icon: Users
    },
      { title: "PROJECTS", url: "/projects", icon: TreePine },
      { title: "EARNINGS", url: "/earnings", icon: PhilippinePeso },
      { title: "MATERIALS", url: "/materials", icon: LibraryBig },
      { title: "DOCUMENTS", url: "/documents", icon: File },
]



export default function AgentSidebar() {
  return (
    <NavSidebar items={items}/>
  );
}