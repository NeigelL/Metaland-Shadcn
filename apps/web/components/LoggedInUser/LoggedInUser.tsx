import { useUserStore } from "@/stores/useUserStore"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { ChevronUp, LogOut, User } from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { canFn } from "../permission"


export default function LoggedInUser() {
  const { user, clearUser } = useUserStore()
  const router = useRouter()
  const superAdmin = canFn('role:super-admin')
  const canImpersonate = canFn('users:impersonate')
  const handleLogout = async () => {
    await fetch('/api/dev/impersonate/clear', { method: 'POST' })
    await signOut()
    clearUser()
    router.push("/")
  }

    return (<>
      <div className="border-t border-gray-200 p-1 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center w-full gap-2 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 w-full overflow-hidden">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 uppercase font-semibold">
                  {user?.image ? (
                    <Image
                      src={user?.image}
                      alt={user?.name || "User Avatar"}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : <User size={16} />
                  )}
                </div>
                <div className="flex flex-col items-start text-left overflow-hidden w-full">
                  <span className="text-sm font-medium truncate w-full">{user?.name}</span>
                  <span className="text-xs text-gray-500 truncate w-full">{user?.email}</span>
                </div>
              </div>
              <ChevronUp className="ml-auto" size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 absolute left-0 bottom-0" align="start" side="top">
            {/* <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer" prefetch={false}>
                <User className="mr-2" size={16} />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem> */}
            {
              superAdmin && canImpersonate && <DropdownMenuItem asChild>
                  <button className="flex items-center w-full" onClick={async (e:any) => {
                    e.preventDefault()
                    const email = prompt("Enter the email of the user to impersonate:", "")
                    if(email && email.trim().length > 0) {
                      let res = await fetch('/api/dev/impersonate', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: email.trim() }),
                      })
                      res = await res.json()
                      if(!res.ok) {
                        alert("Failed to set impersonation cookie.")
                        return
                      }
                      window.location.href = '/'
                    }
                  }}>
                    <User className="mr-2" size={16} />
                    <span className="mr-2">Impersonate</span>
                  </button>
              </DropdownMenuItem>

            }
            {superAdmin && canImpersonate && <DropdownMenuSeparator /> }

            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2" size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>)
}