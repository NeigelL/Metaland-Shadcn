import React, { useCallback, useEffect, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import UppyMultipartUploader from "./UppyUploaderMultipart";
import { getS3FolderFilesQueryApi, s3DeleteObjectQueryApi } from "../api/awsApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "@workspace/ui/components/loader";
import useSocketListener, { useSocketBroadcast } from "@/hooks/useSocketListener";
import { X } from "lucide-react";

// Helper functions defined outside to avoid recreation
const getFileExtension = (key: string) => key.toLowerCase().split(".").pop();

const shouldDisplayImage = (file: any) => {
    const ext = getFileExtension(file.Key);
    return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "");
};

const shouldDisplayPDF = (file: any) => {
    const ext = getFileExtension(file.Key);
    return ["pdf"].includes(ext || "");
};

const shouldDisplayVideo = (file: any) => {
    const ext = getFileExtension(file.Key);
    return ["mp4", "mov", "avi", "wmv", "flv", "webm", "mkv", "m4v"].includes(ext || "");
};

// Memoized FileItem component to prevent unnecessary re-renders
const FileItem = React.memo(({ file, onDelete }: { file: any, onDelete: (key: string) => void }) => {
    const fileName = file.Key.split("/").pop();

    const handleDeleteClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent opening the link
        if (confirm('Are you sure you want to delete ' + fileName + "? ")) {
            onDelete(file.Key);
        }
    }, [file.Key, fileName, onDelete]);

    return (
        <div className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
            {/* Delete Button - Always visible or visible on hover/focus, optimized for touch */}
            <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 z-20 bg-white/90 text-red-500 hover:text-red-700 hover:bg-white rounded-full p-1.5 shadow-sm transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                title="Delete file"
                aria-label={`Delete ${fileName}`}
            >
                <X size={16} />
            </button>

            {/* Main Content - Clickable to view file */}
            <Link prefetch={false} href={file.src} target="_blank" className="block relative aspect-3/2 bg-gray-50">
                {shouldDisplayImage(file) && (
                    <LazyLoadImage
                        alt={file.alt || fileName}
                        className="w-full h-full object-contain"
                        wrapperProps={{
                            style: { transitionDelay: "1s", width: "100%", height: "100%" },
                        }}
                        src={file.src}
                    />
                )}
                {shouldDisplayPDF(file) && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        {/* Use an icon or thumbnail for PDF if possible, otherwise iframe */}
                        <iframe
                            src={file.src}
                            className="w-full h-full pointer-events-none" // Disable interaction with iframe to allow Link click
                            style={{ border: "none" }}
                            title={fileName}
                            loading="lazy"
                            tabIndex={-1}
                        />
                    </div>
                )}
                {shouldDisplayVideo(file) && (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        {/* Video needs to be interactive, so we might not wrap it in Link or handle it differently. 
                             However, for consistency with "click to view", we can overlay a transparent div or just let the user use controls.
                             If we want "click to open in new tab", we need an overlay. 
                             Let's assume video controls are preferred inline, but title link is below.
                         */}
                        <video
                            className="w-full h-full object-contain"
                            controls
                            src={file.src}
                            style={{ border: "none" }}
                            preload="none"
                            onClick={(e) => e.preventDefault()} // Prevent link click if clicking video controls
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </Link>

            {/* Footer - Filename */}
            <div className="p-2 bg-white border-t">
                <Link prefetch={false} href={file.src} target="_blank" className="block">
                    <p className="text-center text-sm text-gray-700 truncate hover:text-blue-600 transition-colors" title={fileName}>
                        {fileName}
                    </p>
                </Link>
            </div>
        </div>
    );
});

FileItem.displayName = "FileItem";

export default function GalleryWithUploader({
    options: { folder = "", entityID = "", collection = "", label = "Files" },
    onCompleteCallback = (f: any) => { },
    createFolderProp = null,
}: any) {
    // Use folder directly, no need for local state unless it changes internally
    const folderPath = folder;

    const { data: awsFiles, refetch, isSuccess, isLoading } = useQuery({
        queryKey: ["s3-files", folderPath],
        queryFn: async () => await getS3FolderFilesQueryApi(folderPath),
        // Keep previous data while fetching new data to avoid flickering
        placeholderData: (previousData) => previousData,
    });

    useSocketListener(folderPath, (data: any) => {
        refetch();
    });

    // Memoize the processed files list
    const files = useMemo(() => {
        if (!awsFiles) return [];

        const tempFiles: any[] = [];

        awsFiles.forEach((file: any) => {
            if (file.Key.endsWith("/")) {
                // It's a folder, ignore for file list
            } else {
                const removedPrefix = file.Key.split(folderPath + "/");
                // Check if it's a direct child of the folder (not in a subfolder)
                if (removedPrefix.length > 1 && !removedPrefix.pop()?.includes("/")) {
                    tempFiles.push(file);
                }
            }
        });
        return tempFiles;
    }, [awsFiles, folderPath]);

    // Trigger callback when files change
    useEffect(() => {
        if (isSuccess) {
            onCompleteCallback(files);
        }
    }, [files, isSuccess, onCompleteCallback]);

    const handleDelete = useCallback((key: string) => {
        s3DeleteObjectQueryApi(key, (res: any) => {
            refetch();
        });
    }, [refetch]);

    const handleUploadComplete = useCallback(() => {
        refetch();
        useSocketBroadcast(folderPath);
    }, [refetch, folderPath]);

    return (
        <>
            {!isLoading && files.length === 0 && <h4 className="text-2xl font-bold mb-6 mt-2">No {label}</h4>}
            {isLoading && files.length === 0 && <h4 className="text-2xl font-bold mb-6"><Loader /></h4>}

            {files.length > 0 && (
                <div className="container mx-auto p-2">
                    <h4 className="text-2xl font-bold mb-6">{label}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {files.map((file: any) => (
                            <FileItem key={file.Key} file={file} onDelete={handleDelete} />
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row pb-10">
                <UppyMultipartUploader
                    options={{ folder: folderPath, entityID: entityID, collection: collection }}
                    onCompleteCallback={handleUploadComplete}
                    createFolderProp={createFolderProp}
                />
            </div>
        </>
    );
}