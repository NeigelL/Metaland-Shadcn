"use client"
// import Sidebar from "@/components/Sidebar";
// import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { CurrentUserProvider } from "@/provider/CurrentUserProvider";
// import { SessionProvider } from "next-auth/react"
const queryClient = new QueryClient()

export default function MainClientLayout({children, user}:any) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const parsedUser = JSON.parse(user)


return(<QueryClientProvider client={queryClient}>
          { parsedUser?.user_id ? <>
          {/* <SessionProvider session={parsedUser}> */}
            {/* <CurrentUserProvider state={parsedUser}> */}
            {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
              <div className="relative flex flex-1 flex-col lg:ml-62.5">
                {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
              {children}
              </div>
              {/* </CurrentUserProvider> */}
            {/* </SessionProvider> */}
            </> : <div className="relative flex flex-1 flex-col">{children}</div>
          }
   </QueryClientProvider>)
}