import LoginPage from "@/app/login/page";
import { auth } from "@/lib/nextAuthOptions";
import React from "react";

export default async function DefaultLayout({children}: {children: React.ReactNode}) {
  const user:any = await auth()
  if(!user || !user?.login) {
    return <LoginPage />
  }

  return children
}
