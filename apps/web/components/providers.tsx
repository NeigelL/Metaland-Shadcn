"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useUserStore } from "@/stores/useUserStore";
import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { AdminAppSidebar } from "./admin-sidebar";
import { BuyerAppSidebar } from "./buyer-sidebar";
import { LoginPage } from "./LoginPage";

const queryClient = new QueryClient()
export function Providers({ children, user, accountType }: { user:any, accountType : string , children: React.ReactNode }) {

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
              { accountType == "admin" && <AdminAppSidebar /> }
              { accountType == "agent" && <AdminAppSidebar /> }
              { accountType == "buyer" && <BuyerAppSidebar /> }
              <main className="flex-1 flex flex-col">
                <SidebarTrigger />
                {children}
              </main>
            </SidebarProvider>
          </SessionProvider>
          </> : <div className="relative flex flex-1 flex-col">
            <LoginPage/>
          </div>
        }
      </QueryClientProvider>
    </NextThemesProvider>
  )
}
