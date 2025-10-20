"use client";
import { useUserStore } from "@/stores/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Card, CardContent } from "@workspace/ui/components/card";

export default function AvatarUser() {
    const { user } = useUserStore();
    return (<>
    <div className="mb-4 pb-3 border-b border-gray-200 flex justify-between items-center">
              <Card className="shadow-md w-full">
                  <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-16 w-16 mt-2 cursor-pointer relative">
                      <AvatarImage src={ user?.image ?? ""} alt={`${user?.name}'s Photo`} />
                      <AvatarFallback>
                        {user?.name}
                      </AvatarFallback>
                      {/* <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      /> */}
                    </Avatar>

                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{user?.name || "User"}</h3>
                    </div>
                  </div>
                  </CardContent>
                </Card>
          </div>
    </>)
}