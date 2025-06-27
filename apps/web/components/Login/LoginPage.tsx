"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { signIn} from "next-auth/react";
import { cn } from "@workspace/ui/lib/utils";
import { useSearchParams } from "next/navigation";


interface LoginPageProps {
  className?: string;
  url?: string;
}

export function LoginPage({ className, url = "https://"+process.env.NEXT_BUYER_DOMAIN || 'https://buyer.metaland.properties' }: LoginPageProps) {
  // const [error] = useState("");
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const msg = searchParams.get('msg')
  
  const handleLogin = async() => {
    await signIn('google',{
      redirect: true,
      callbackUrl: url
    })
  };

  const messages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You denied the request to sign in.',
    Verification: 'The sign in link is no longer valid.',
    OAuthCallback: 'There was an issue with the sign-in process. Please try again.',
    default: 'Something went wrong during authentication.',
    EmailNotFound: 'Email not found! Please register and request for login access',
    UnAuthorized: 'Unauthorized access. Please log in again.',
    NoRole: 'You do not have the required role to access this page.'
  }

  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen bg-gray-50">
      {/* Logo section - visible on all screen sizes */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white md:h-screen">
        <div className="w-full max-w-xs md:max-w-md">
          <img
            src="/images/metaland.png"
            alt="Metaland Buyer's Portal"
            className="w-full h-auto"
          />
        </div>
      </div>
      
      {/* Divider - only visible on desktop */}
      <div className="hidden md:flex w-px bg-gray-300 h-64 self-center"></div>
      
      {/* Login form section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8">
        <Card className={cn("w-full max-w-sm md:max-w-lg p-4 md:p-6", className)}>
          <CardHeader className="text-center md:text-left">
            <CardTitle className="text-xl md:text-2xl">Log In</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Log in using your Google account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <button
              onClick={handleLogin}
              className="w-full bg-gray-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-3 md:py-2 px-4 rounded text-sm md:text-base transition-colors duration-200"
            >
              Sign in with Google
            </button>
              {error && <p className="text-red-500 text-center text-xs md:text-sm">
                  {messages[error ?? 'default'] ?? messages.default}
              </p>}
              {
                msg && <p className="text-red-500 text-center text-xs md:text-sm">
                  {msg}
                </p>
              }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}