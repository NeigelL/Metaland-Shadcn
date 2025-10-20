import { LucideIcon } from "lucide-react"

export type MenuItem = {
    title: string,
    title_show?: boolean
    url?: string,
    icon?: LucideIcon,
    permissions?: string[] | string,
    isActive?: boolean,
    items?: MenuItem[]
}