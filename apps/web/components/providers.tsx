"use client"

import { useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { SessionProvider } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"

const queryClient = new QueryClient()

export function Providers({ user, children }: { user:any, children: React.ReactNode }) {
    const parsedUser = JSON.parse(user)
    useEffect(()=> {
  
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
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryClientProvider client={queryClient}>
      {
        parsedUser?.user_id ? (
          <SessionProvider session={parsedUser}>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 flex flex-col">
                  <SidebarTrigger />
                  {children}
                </main>
              </SidebarProvider>
          </SessionProvider>
        ) : (
          <div className="relative flex flex-1 flex-col">{children}</div>
        )
      }
        </QueryClientProvider>
    </NextThemesProvider>
  )
}
