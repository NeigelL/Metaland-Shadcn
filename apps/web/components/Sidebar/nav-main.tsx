import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@workspace/ui/components/sidebar"
import { ChevronRight, LucideIcon } from "lucide-react"
import Link from "next/link"

export default function NavMain({
    items
} : {
    items: {
        title: string,
        title_show?: boolean,
        url?: string,
        icon?: LucideIcon,
        isActive?: boolean,
        items?: {
            title: string,
            url: string,
            icon?: LucideIcon
        }[]
    }[]
}) {

    return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
            <>
          {item?.title_show && <SidebarGroupLabel>{item.title}</SidebarGroupLabel> }
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                    {
                        item.url && <Link href={item.url} className="flex items-center gap-2 w-full">
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </Link>
                    }
                    {
                        !item.url && <>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </>
                    }
                  { item && item.items && item?.items?.length > 0 && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
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
          </Collapsible></>
        ))}
      </SidebarMenu>
    </SidebarGroup>
    )

}