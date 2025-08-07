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
      title: "AGENT",
      url: "/agents",
      icon: LandPlot,
    },
    {
      title: "CLIENTS",
      url: "/clients",
      icon: Factory,
    }
]



export default function RealtySidebar() {
  return (
    <NavSidebar items={items}/>
  );
}