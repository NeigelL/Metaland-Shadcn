"use client";

import { LandPlot, HomeIcon, Factory } from "lucide-react";
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
    icon: Factory,
  },
  {
    title: "RESERVATIONS",
    url: "/reservations",
    icon: LandPlot,
  },
  {
    title: "My Agents",
    url: "/agents",
    icon: HomeIcon,
  }
  // ,
  // {
  //   title: "My Buyers",
  //   url: "/buyers",
  //   icon: HomeIcon,
  // }
]



export default function SalesManagerSidebar() {
  return (
    <NavSidebar items={items} />
  );
}