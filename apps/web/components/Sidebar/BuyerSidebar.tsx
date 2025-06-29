"use client";

import { LandPlot, HomeIcon } from "lucide-react";
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
    }
]



export default function BuyerSidebar() {
  return (
    <NavSidebar items={items}/>
  );
}