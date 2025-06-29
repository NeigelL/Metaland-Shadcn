"use client";

import { LandPlot, LucideIcon, HomeIcon, Users, TreePine, PhilippinePeso, LibraryBig, File } from "lucide-react";
import NavSidebar from "./nav-sidebar";
import { MenuItem } from "@/types/menu";



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