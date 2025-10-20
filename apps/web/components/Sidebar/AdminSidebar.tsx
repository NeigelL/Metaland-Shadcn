"use client";

import { Home, HandCoins, LucideLibrary, Flag, FileText, UtilityPole } from "lucide-react";
import NavSidebar from "./nav-sidebar";
import { MenuItem } from "@/types/menu";


const items: MenuItem[] = [
    {
        title: "HOME",
        isActive : true,
        icon: Home,
        items: [
            { icon: Home , title: "Dashboard", url: "/" },
            { title: "Reservations", url: "/reservations", icon: Home },
            { title: "Companies", url: "/companies", icon: Home },
            { title: "Projects", url: "/projects", icon: Home },
            { title: "Buyers", url: "/buyers", icon: Home },
            { title: "Agent", url: "/agents", icon: Home },
            { title: "Team Lead", url: "/team-lead", icon: Home },
            { title: "Realties", url: "/realties", icon: Home },
            { title: "Incentives", url: "/incentives", icon: Home },
            { title: "Sample Calculation", url: "/monthly-calculator", icon: Home },
            { title: "Users", url: "/users", icon: Home }
        ],
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
        title: "Assets",
        icon: LucideLibrary,
        items: [
            { title: "Agent", url: "/assets/agent"},
        ]
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
        title: "FAQ",
        icon: HandCoins,
        items: [
            { title: "Buyers FAQ", url: "/faq/buyers-faq"},
            { title: "Agents FAQ", url: "/faq/agents-faq"},
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
        title: "Users",
        icon: Flag,
        items: [
            { title: "All Users", url: "/users/all-users"},
            { title: "Buyers", url: "/users/buyers"},
            {title: "Agents", url: "/users/agents"},
            {title: "Team Leads", url: "/users/team-leads"},
        ]
    },
    { title: "Buyer Prospects", url: "/prospects/buyers", icon: Home },
    { title: "Tasks", url: "/tasks", icon: Home },
    { title: "Incentives", url: "/incentives", icon: Home },
    { title: "Portal Access Logs", url: "/portal-access-logs", icon: Home },
    { title: "Projects", url: "/projects", icon: Home },
    { title: "Promo", url: "/promo", icon: Home },
    { title: "Realties", url: "/realties", icon: Home },
    { title: "Sample Calculation", url: "/monthly-calculator", icon: Home },
    { title: "Workflows", url: "/workflows", icon: Home },
    { title: "Uploaded Proofs", url: "/user-proofs", icon: Home },
    {
        title: "Amortization Data Integrity",
        icon: FileText,
        items: [
            { icon: Home, title: "No Agent Amortizations", url: "/data-integrity/no-agent-amortizations", },
            { icon: Home, title: "No Realty Amortizations", url: "/data-integrity/no-realty-amortizations"},
            { icon: Home, title: "Double Check Commission Percent Amortizations", url: "/data-integrity/commission-percent-amortizations"},
            { icon: Home, title: "No Reservation Amortizations", url: "/data-integrity/no-reservation-date-amortizations" },
            { icon: Home, title: "Unlock Commission Sharing Amortizations", url: "/data-integrity/unlock-commission-sharing" },
            { icon: Home, title: "Double Book Reservation", url: "/data-integrity/double-book-reservation-amortizations"},
            { icon: Home, title: "Agent Buyers Amortizations", url: "/data-integrity/agent-buyers-amortizations" },
            { icon: Home, title: "No Payment / Reservation Only", url: "/data-integrity/no-payment-reservation-only" }
        ]
    },
    {
        title: "Payments Data Integrity",
        icon: FileText,
        items: [
            { icon: Home, title: "No Invoice", url: "/data-integrity/no-invoice-payments"}
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