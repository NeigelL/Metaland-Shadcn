"use client";

import { LandPlot, LucideIcon, HomeIcon } from "lucide-react";
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
    }
]



export default function BuyerSidebar() {
  return (
    <NavSidebar items={items}/>
  );
}