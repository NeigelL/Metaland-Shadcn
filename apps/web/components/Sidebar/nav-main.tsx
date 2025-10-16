import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@workspace/ui/components/sidebar"
import { ChevronRight, LucideIcon } from "lucide-react"
import Link from "next/link"
import { canFn } from "../permission"

export default function NavMain({
    items
} : {
    items: {
        title: string,
        title_show?: boolean,
        url?: string,
        icon?: LucideIcon,
        permissions?: string[] | string,
        isActive?: boolean,
        items?: {
            title: string,
            url: string,
            icon?: LucideIcon
        }[]
    }[]
}) {
   const {
    openMobile,
    setOpenMobile,
  } = useSidebar()
    return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            (!item?.permissions || canFn(item.permissions)) && <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                        {item.url && item.icon && <item.icon size={14} className="text-gray-500"/>}
                          {item.url && item.icon && <Link onClick={
                            (e:any) => setOpenMobile(!openMobile)
                          } prefetch={false} href={item.url} className="flex items-center gap-2 w-full text-gray-500"><span className="text-xs">{item.title}</span>
                      </Link>}
                      {!item.url && <>
                              {item.icon && <item.icon size={14} className="text-gray-500"/>}
                              <span className="text-xs">{item.title}</span>
                          </> }
                    { item && item.items && item?.items?.length > 0 && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url} onClick={
                            (e:any) => setOpenMobile(!openMobile)
                          }>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      
    </SidebarGroup>
    )

}