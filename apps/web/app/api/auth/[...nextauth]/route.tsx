import nextInstance from "@/lib/nextAuthOptions";
import NextAuth from "next-auth/next";

const nextAuthInstance = NextAuth(nextInstance)
export  { nextAuthInstance as GET, nextAuthInstance as POST }
