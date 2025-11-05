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
  title: "Admin Portal",
  description: "Admin Portal",
  openGraph: {
    title: "Admin Portal",
    description: "Admin Portal",
    images: [
      {
        url: "/images/metaland.png",
        width: 1200,
        height: 630,
        alt: "Metaland Admin Portal Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Portal",
    description: "Admin Portal",
    images: ["/images/metaland.png"],
  },
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
          accountType="admin"
          callbackURL={ ["https://", process.env.NEXT_AGENT_DOMAIN || "admin.metaland.properties"].join("") }
        >
          {children}
        </Providers>
      </body>
    </html>
  )
}
