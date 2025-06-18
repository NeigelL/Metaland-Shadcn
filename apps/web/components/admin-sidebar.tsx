"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LandPlot, TreePine, File, User, Home, LogOut, ChevronUp, Users, PhilippinePeso, LibraryBig, ChevronRight } from "lucide-react";
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
import LoggedInUser from "./LoggedInUser/LoggedInUser";

// Define types for menu items
type MenuItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
} | {
  title: string;
  isActive?: boolean;
  icon?: any;
  submenu: {
    title: string;
    url: string;
    icon?: any;
  }[];
};

const itemGroups: MenuItem[] = [
    {
        title: "APPLICATION",
        isActive : true,
        icon: <Home size={14}/>,
        submenu: [
            { icon: <Home size={14} />, title: "Dashboard", url: "/" },
            { title: "Companies", url: "/companies", icon: <Home size={14} /> },
            { title: "Projects", url: "/projects", icon: <Home size={14} /> },
            { title: "Buyers", url: "/buyers", icon: <Home size={14} /> },
            { title: "Agent", url: "/agents", icon: <Home size={14} /> },
            { title: "Team Lead", url: "/team-lead", icon: <Home size={14} /> },
            { title: "Realties", url: "/realties", icon: <Home size={14} /> },
            { title: "Reservations", url: "/reservations", icon: <Home size={14} /> },
            { title: "Incentives", url: "/incentives", icon: <Home size={14} /> },
            { title: "Sample Calculation", url: "/monthly-calculator", icon: <Home size={14} /> },
            { title: "Users", url: "/users", icon: <Home size={14} /> }
        ],
    },
    {
        title: "Collections",
        submenu: [
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
        submenu: [
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
        submenu: [
            { title: "No TIN", url: "/reporting/no-tins"},
            { title: "Top Sellers by Agent", url: "/reporting/top-sellers"},
            {title: "Top Sellers by Realties", url: "/reporting/top-sellers-realties"},
            {title: "Top Sellers by Team Leads", url: "/reporting/top-team-lead"},
            {title: "Tag Reporting", url: "/tag-reporting"}
        ]
    },
    {
        title: "Data Integrity",
        submenu: [
            { icon: <Home/>, title: "No Agent Amortizations", url: "/data-integrity/no-agent-amortizations", },
            { icon: <Home/>, title: "No Realty Amortizations", url: "/data-integrity/no-realty-amortizations"},
            { icon: <Home/>, title: "Double Check Commission Percent Amortizations", url: "/data-integrity/commission-percent-amortizations"},
            { icon: <Home/>, title: "No Reservation Amortizations", url: "/data-integrity/no-reservation-date-amortizations" },
            { icon: <Home/>, title: "Unlock Commission Sharing Amortizations", url: "/data-integrity/unlock-commission-sharing" },
            { icon: <Home/>, title: "Double Book Reservation", url: "/data-integrity/double-book-reservation-amortizations"},
            { icon: <Home/>, title: "Agent Buyers Amortizations", url: "/data-integrity/agent-buyers-amortizations" }
        ]
    },
    // {
    //     title: "Payments",
    //     submenu: [
            // { title: "No Invoice Payments", url: "/data-integrity/no-invoice-payments" },
            // {
            //   icon: <Home size={14} />,
            //   title: "Lot Available but has Amortization",
            //   url: "/data-integrity/lot-available-amortizations",
            // }
    //     ]
    // },
    {
        title: "Utilities",
        submenu: [
            { icon: <Home size={14} />, title: "Clean Up", url: "/utilities" }
        ]
    }
]

const items: MenuItem[] = [
//     {
//     title: "MENU",
//     submenu: [
//       { title: "DASHBOARD", url: "/", icon: <Home size={14} /> },
//       { title: "CLIENTS", url: "/agentclients", icon: <Users size={14} /> },
//       { title: "LOTS", url: "/agentlots", icon: <LandPlot size={14} /> },
//       { title: "PROJECTS", url: "/agentproject", icon: <TreePine size={14} /> },
//       { title: "EARNINGS", url: "/agentearnings", icon: <PhilippinePeso size={14} /> },
//       { title: "MATERIALS", url: "/agentmaterials", icon: <LibraryBig size={14} /> },
//       { title: "DOCUMENTS", url: "/agentdocuments", icon: <File size={14} /> },
//     ],
//   }
];


export function AdminAppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activePath, setActivePath] = useState(pathname);
  const [mounted, setMounted] = useState(false);
  const { user, clearUser } = useUserStore();
  useEffect(() => {
    setMounted(true);
    setActivePath(pathname);
  }, [pathname]);



  if (!mounted) return null; 

  return (
    <Sidebar className="flex flex-col justify-between h-screen w-64">
      <SidebarContent className="relative">
        <div className="flex flex-col items-center">
          <Image src="/images/metaland.png" alt="Logo" width={250} height={250} />
        </div>
          {itemGroups.map((group:any) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {/* {group.submenu.map((item: any, key:any) => ( */}
                <Collapsible
                  key={group.title}
                  asChild
                  defaultOpen={group.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={group.title}>
                        {group.icon}
                        <span>{group.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />

                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.submenu?.map((subItem:any) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              {/* ))} */}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer with Dropdown */}
      <LoggedInUser/>
    </Sidebar>
  );
}