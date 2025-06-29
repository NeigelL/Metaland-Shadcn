"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LandPlot, TreePine, File, User, Home, LogOut, ChevronUp, Users, PhilippinePeso, LibraryBig, ChevronRight, HandCoins, LucideLibrary, Flag, FileText, UtilityPole } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useUserStore } from "@/stores/useUserStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import LoggedInUser from "../LoggedInUser/LoggedInUser";
import ImageLogo from "./ImageLogo";
import NavSidebar from "./nav-sidebar";
import { MenuItem } from "@/types/menu";


const items: MenuItem[] = [
    {
        title: "APPLICATION",
        isActive : true,
        icon: Home,
        items: [
            { icon: Home , title: "Dashboard", url: "/" },
            { title: "Companies", url: "/companies", icon: Home },
            { title: "Projects", url: "/projects", icon: Home },
            { title: "Buyers", url: "/buyers", icon: Home },
            { title: "Agent", url: "/agents", icon: Home },
            { title: "Team Lead", url: "/team-lead", icon: Home },
            { title: "Realties", url: "/realties", icon: Home },
            { title: "Reservations", url: "/reservations", icon: Home },
            { title: "Incentives", url: "/incentives", icon: Home },
            { title: "Sample Calculation", url: "/monthly-calculator", icon: Home },
            { title: "Users", url: "/users", icon: Home }
        ],
    },
    {
        title: "Collections",
        icon: HandCoins,
        items: [
            { title: "Sales Generator", url: "/sales"},
            { title: "Running Report", url: "/sales/running-report"},
            { title: "Monthly Collectible Report", url: "/sales/monthly-collectibles"},
            { title: "Delinquent Report", url: "/reporting/delinquents"},
            { title: "Accept Payment", url: "/payments/accept-payment"},
            { title: "Acceptable Payment", url: "/payments/acceptable-payment" },
            { title: "Receiver Account", url: "/payments/receiver-account" },
            { title: "Deposits", url: "/payments/deposits" }
        ]
    },
    {
        title: "Accounting",
        icon: LucideLibrary,
        items: [
            { title: "Expenses", url: "/accounting/expenses"},
            { title: "Monthly Expenses", url: "/accounting/expenses-monthly"},
            { title: "Monthly Purchases", url: "/accounting/purchases-monthly"},
            { title: "Expense Reports", url: "/accounting/expense-reports"},
            { title: "Fund Request", url: "/accounting/fund-requests"},
            { title: "Request Approvers", url: "/accounting/requests-approvers"},
            { title: "Voucher", url: "/accounting/vouchers"},
            { title: "Cheque", url: "/accounting/cheque" },
            { title: "Commission", url: "/accounting/commission" },
            { title: "Commission Explorer", url: "/accounting/commission-explorer" },
            { title: "Reports", url: "/accounting/reports" },
        ]
    },
    {
        title: "Reporting",
        icon: Flag,
        items: [
            { title: "No TIN", url: "/reporting/no-tins"},
            { title: "Top Sellers by Agent", url: "/reporting/top-sellers"},
            {title: "Top Sellers by Realties", url: "/reporting/top-sellers-realties"},
            {title: "Top Sellers by Team Leads", url: "/reporting/top-team-lead"},
            {title: "Tag Reporting", url: "/tag-reporting"}
        ]
    },
    {
        title: "Data Integrity",
        icon: FileText,
        items: [
            { icon: Home, title: "No Agent Amortizations", url: "/data-integrity/no-agent-amortizations", },
            { icon: Home, title: "No Realty Amortizations", url: "/data-integrity/no-realty-amortizations"},
            { icon: Home, title: "Double Check Commission Percent Amortizations", url: "/data-integrity/commission-percent-amortizations"},
            { icon: Home, title: "No Reservation Amortizations", url: "/data-integrity/no-reservation-date-amortizations" },
            { icon: Home, title: "Unlock Commission Sharing Amortizations", url: "/data-integrity/unlock-commission-sharing" },
            { icon: Home, title: "Double Book Reservation", url: "/data-integrity/double-book-reservation-amortizations"},
            { icon: Home, title: "Agent Buyers Amortizations", url: "/data-integrity/agent-buyers-amortizations" }
        ]
    },
    {
        title: "Utilities",
        icon: UtilityPole,
        items: [
            { icon: Home, title: "Clean Up", url: "/utilities" }
        ]
    }
]



export default function AdminSidebar() {

  return (
    <NavSidebar items={items}/>
  );
}