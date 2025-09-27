"use client"

import FileFolderGallery from "@/components/Uploads/FileFolderGallery";

const AssetsPage = ()=> {
    return (
        <div className="w-full mx-auto p-2 sm:p-6">
            <div className="mb-6 space-y-6">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                            AVAILABLE ASSETS
                        </h1>
                    </div>
                </div>
                <div className="w-full">
                    <FileFolderGallery
                        options={{
                            folder: ["agent-assets"].join("/"),
                            entityID: "agent-assets",
                            collection: "agent-assets"
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AssetsPage;