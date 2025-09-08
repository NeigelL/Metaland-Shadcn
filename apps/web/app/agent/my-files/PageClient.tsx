"use client"

import GalleryWithUploader from "@/components/Uploads/GalleryWithUploader";
import { useUserStore } from "@/stores/useUserStore";

const MyFilePage = ()=> {
    const {user_id} = useUserStore()
    return (
        <div className="w-full mx-auto p-2 sm:p-6">
            <div className="mb-6 space-y-6">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                            MY FILES
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-col gap-3 mb-4">
                    <GalleryWithUploader
                        options={{
                            folder: ["portal","user", user_id].join("/"),
                            entityID: "portal-user-files",
                            collection: "portal-user-files"
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default MyFilePage;