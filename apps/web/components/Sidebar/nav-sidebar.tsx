import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import ImageLogo from "./ImageLogo";
import NavMain from "./nav-main";
import LoggedInUser from "../LoggedInUser/LoggedInUser";

export default function NavSidebar({
    items
}: {items: any[]}) {
  return (
    <>
    <Sidebar collapsible="icon" className="flex flex-col justify-between h-screen w-64">
      <SidebarHeader className="flex items-center justify-between p-4">
        <ImageLogo/>
      </SidebarHeader>
      <SidebarContent className="relative">
          <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
         <LoggedInUser/>
      </SidebarFooter>
      <SidebarRail className="flex flex-col"/>
    </Sidebar>
    </>
  );
}