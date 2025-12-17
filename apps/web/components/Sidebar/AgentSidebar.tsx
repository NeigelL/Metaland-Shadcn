"use client";

import { HomeIcon, TreePine, Factory, Users, Paperclip, File } from "lucide-react";
import NavSidebar from "./nav-sidebar";
import { MenuItem } from "@/types/menu";



const items: MenuItem[] = [
  {
    title: "DASHBOARD",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "PROJECTS",
    url: "/projects",
    icon: TreePine,
  },
  {
    title: "FAQ",
    url: "/faq",
    icon: Factory,
  },
  {
    title: "MY FILES",
    url: "/my-files",
    icon: File,
    permissions: ["users:manage-assets"]
  },
  {
    title: "AVAILABLE ASSETS",
    url: "/assets",
    icon: Paperclip,
    permissions: ["users:manage-assets"]
  },
  {
    title: "PROSPECTS",
    url: "/prospects",
    icon: Users,
    permissions: ["users:manage-prospects"]
  },
  {
    title: "CLIENTS",
    url: "/lots",
    icon: Users
  },
  // { title: "PROJECTS", url: "/projects", icon: TreePine },
  // { title: "EARNINGS", url: "/earnings", icon: PhilippinePeso },
  // { title: "MATERIALS", url: "/materials", icon: LibraryBig },
  // { title: "DOCUMENTS", url: "/documents", icon: File },
]

export default function AgentSidebar() {
  return (
    <NavSidebar items={items} />
  );
}