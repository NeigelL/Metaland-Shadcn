"use client";

import { HomeIcon,  TreePine,  Factory } from "lucide-react";
import NavSidebar from "./nav-sidebar";
import { MenuItem } from "@/types/menu";



const items: MenuItem[] = [
    {
      title: "DASHBOARD",
      url: "/",
      icon: HomeIcon,
    },
      {
      title: "FAQ",
      url: "/faq",
      icon: Factory,
    },
    {
      title: "PROJECTS",
      url: "/projects",
      icon: TreePine,
    },
    // {
    //   title: "CLIENTS",
    //   url: "/clients",
    //   icon: Users
    // },
      // { title: "PROJECTS", url: "/projects", icon: TreePine },
      // { title: "EARNINGS", url: "/earnings", icon: PhilippinePeso },
      // { title: "MATERIALS", url: "/materials", icon: LibraryBig },
      // { title: "DOCUMENTS", url: "/documents", icon: File },
]



export default function AgentSidebar() {
  return (
    <NavSidebar items={items}/>
  );
}