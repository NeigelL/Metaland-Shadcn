import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { getServerSession } from "next-auth"
import nextAuthOptions from "@/lib/nextAuthOptions"
import { Metadata } from "next"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
    title: "Realty Portal",
    description: "Realty Portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getServerSession(nextAuthOptions)
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers
          user={JSON.stringify(user)}
          accountType="agent"
          callbackURL={ ["https://", process.env.NEXT_AGENT_DOMAIN || "agent.metaland.properties"].join("") }
        >
          {children}
        </Providers>
      </body>
    </html>
  )
}
