"use client";
import { signIn } from "next-auth/react";

export default function  SignInButton() {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      onClick={
        async() => {
            await await signIn('google', { redirect: false, callbackUrl : 'https://localhost:5002' })
        }
    }
    >
      Sign In
    </button>
  );
}