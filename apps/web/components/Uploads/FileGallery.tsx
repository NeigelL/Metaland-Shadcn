import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useQuery } from "@tanstack/react-query";
import { getS3FolderFilesQueryApi } from "../api/awsApi";
interface FileGalleryProps {
    options: {
        folder?: string;
        entityID?: string;
        collection?: string;
    };
    onCompleteCallback?: (folder: string) => void;
}

interface S3File {
    Key: string;
    src: string;
    alt?: string;
    [key: string]: any;
}

const isImage = (key: string) => {
    const ext = key.toLowerCase().split(".").pop();
    return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "");
};

const isPDF = (key: string) => {
    const ext = key.toLowerCase().split(".").pop();
    return ["pdf"].includes(ext || "");
};

const isVideo = (key: string) => {
    const ext = key.toLowerCase().split(".").pop();
    return ["mp4", "webm", "ogg", "mov"].includes(ext || "");
};

const FileCardSkeleton = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm animate-pulse">
        <div className="h-48 bg-gray-200 w-full" />
        <div className="p-4 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
    </div>
);

function FileGallery({ options: { folder = "" }, onCompleteCallback }: FileGalleryProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: any) => {
                if (entries && entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const { data: awsFiles, isLoading } = useQuery({
        queryKey: ["s3-files", folder],
        queryFn: async () => await getS3FolderFilesQueryApi(folder),
        enabled: isVisible && !!folder,
        staleTime: 0, // 5 minutes
    });

    const files = useMemo(() => {
        if (!awsFiles) return [];
        return (awsFiles as S3File[]).filter(file => !file.Key.endsWith("/"));
    }, [awsFiles]);

    useEffect(() => {
        if (awsFiles && onCompleteCallback) {
            onCompleteCallback(folder);
        }
    }, [awsFiles, folder, onCompleteCallback]);

    return (
        <div ref={containerRef} className="w-full">
            {/* Placeholder for intersection observer */}
            {!isVisible && <div className="h-20 w-full bg-gray-50 rounded-lg border border-dashed border-gray-300" />}

            {isVisible && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Files</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {isLoading ? "Loading..." : `${files.length} items`}
                        </span>
                    </div>

                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => <FileCardSkeleton key={i} />)}
                        </div>
                    )}

                    {!isLoading && files.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            <p className="text-sm font-medium">No files found in this folder</p>
                        </div>
                    )}

                    {!isLoading && files.length > 0 && (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${files.length > 8 ? "max-h-[600px] overflow-y-auto pr-2 custom-scrollbar" : ""}`}>
                            {files.map((file) => (
                                <div key={file.Key} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col">
                                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                        {isImage(file.Key) ? (
                                            <LazyLoadImage
                                                alt={file.alt || file.Key}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                wrapperProps={{
                                                    style: { transitionDelay: "1s" },
                                                }}
                                                src={file.src}
                                            />
                                        ) : isVideo(file.Key) ? (
                                            <video
                                                src={file.src}
                                                className="w-full h-full object-cover"
                                                muted
                                                preload="metadata"
                                            />
                                        ) : isPDF(file.Key) ? (
                                            <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500">
                                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Overlay Action */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <a
                                                href={file.src}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-blue-50 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-200"
                                            >
                                                View File
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-gray-100 bg-white flex-1 flex flex-col justify-center">
                                        <p className="text-sm font-medium text-gray-700 truncate" title={file.Key.split("/").pop()}>
                                            {file.Key.split("/").pop()}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                                            {file.Key.split(".").pop()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default memo(FileGallery);