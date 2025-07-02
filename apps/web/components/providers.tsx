"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useUserStore } from "@/stores/useUserStore";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { LoginPage } from "./Login/LoginPage";
import dynamic from "next/dynamic";
import Loader from "@workspace/ui/components/loader";
import GoogleAnalytics from "./GoogleAnalytics/GoogleAnalytics";


const queryClient = new QueryClient()
const AdminSidebar = dynamic( () => import("./Sidebar/AdminSidebar"), {
  ssr: false,
  loading: () => <div><Loader/></div>
})

const AgentSidebar = dynamic( () => import("./Sidebar/AgentSidebar"), {
  ssr: false,
  loading: () => <div><Loader/></div>
})

const BuyerAppSidebar = dynamic( () => import("./Sidebar/BuyerSidebar"), {
  ssr: false,
  loading: () => <div><Loader/></div>
})

export function Providers({ children, user, accountType, callbackURL }: { user:any, accountType : string , callbackURL : string, children: React.ReactNode }) {

  const {setUser, user_id} = useUserStore()

  React.useEffect(() => {
      setUser(JSON.parse(user))
  }, [user])


  React.useEffect(()=> {

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js') // path to your bundled service worker with GoldenRetriever service worker
        .then((registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope,
          );
        })
        .catch((error) => {
          console.log(`Registration failed with ${error}`);
        });
    }

  },[])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryClientProvider client={queryClient}>
        {
          user && user !== "null" ? <>
          <SessionProvider session={JSON.parse(user)}>
            <SidebarProvider>
              { accountType == "admin" && <AdminSidebar /> }
              { accountType == "agent" && <AgentSidebar /> }
              { accountType == "buyer" && <BuyerAppSidebar /> }
              <SidebarInset className="flex-1 flex flex-col">
                 <SidebarTrigger />
                {children}
              </SidebarInset>
            </SidebarProvider>
          </SessionProvider>
          </> : <div className="relative flex flex-1 flex-col">
            <LoginPage
             url={callbackURL}
            />
          </div>
        }
        <GoogleAnalytics GA_ID={process.env.NEXT_PUBLIC_GA_ID} />
      </QueryClientProvider>
    </NextThemesProvider>
  )
}
