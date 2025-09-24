import { memo, useCallback, useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import Loader from "@workspace/ui/components/loader";
import { useQuery } from "@tanstack/react-query";
import { getS3FolderFilesQueryApi } from "../api/awsApi";
function FileGallery({options : { folder="", entityID = "", collection = ""} , onCompleteCallback = (f:any) => {}  } : any) {


    const [files, setFiles] = useState([])
    const [filesRequesting, setFilesRequesting] = useState(true)
    const [filesRequested, setFilesRequested] = useState(false)
    const [folderPath] = useState(folder)
    const observerRefFile = useRef<IntersectionObserver | null>(null)
    const loadAwsImagesRef = (node:any) => {
        if(filesRequested) return
        if(observerRefFile.current) observerRefFile.current.disconnect()
        observerRefFile.current = new IntersectionObserver( async(entries:any) => {
            if(entries[0].isIntersecting && folderPath) {
                await onCompleteCallbackBase(folderPath)
            }
        })
        if(node) observerRefFile.current.observe(node)
    }

    const {data: awsFiles, refetch: onCompleteCallbackBase } = useQuery({
        queryKey: ["s3-files", folderPath],
        queryFn: async() => await getS3FolderFilesQueryApi(folderPath)
    })

    useEffect(() => {
        if(awsFiles) {
            let tempFiles:any = []
            awsFiles.map( (file:any, key:any) => {
                if( file.Key[file.Key.length-1] === "/" ) {
                } else {
                    tempFiles.push(file)
                }
            })
            setFiles(tempFiles)
            setFilesRequesting(false)
            setFilesRequested(true)
            onCompleteCallback(folderPath)
        }
    }, [awsFiles])


    const shouldDisplayImage = useCallback( (file:any) =>{
        let ext = file.Key.toLowerCase().split(".").pop()
        return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)
    },[])

    const isPDF = useCallback( (file:any) =>{
        let ext = file.Key.toLowerCase().split(".").pop()
        return ["pdf"].includes(ext)
    },[])

    return (
        <>
            <div className="" ref={loadAwsImagesRef}>
            </div>
            {!filesRequesting && files.length == 0 && <h4 className="text-sm font-bold mb-6">No Files</h4>}
            {filesRequesting && files.length == 0 && <h4 className="text-sm font-bold mb-6"><Loader/></h4>}

            {files.length > 0 &&
                <div className="container mx-auto p-2">
                    <div className={"grid grid-cols-1 sm:grid-cols-1 sm:min-h-20 sm:max-w-[240px] md:max-w-full md:max-h-full md:grid-cols-4" + (files.length > 2 ? " max-h-40 overflow-y-scroll" : "")}>
                        {files.map((file:any) => (
                        <div key={file.Key} className="relative group">
                                { shouldDisplayImage(file) && <LazyLoadImage
                                        alt={file.alt}
                                        className="w-full h-48 object-cover rounded shadow-md"
                                        // effect="blur"
                                        wrapperProps={{
                                            style: {transitionDelay: "1s"},
                                        }}
                                        src={file.src} />
                                }
                                {
                                    isPDF(file) && <div className="w-full h-48 object-cover rounded shadow-md">
                                        <iframe
                                            src={file.src}
                                            className="w-full h-full"
                                            style={{border:"none"}}
                                            title={file.Key.split("/").pop()}/>
                                    </div>
                                }

                            <div className={"cursor-pointer absolute inset-0 flex items-center justify-center " + (isPDF(file) ? "hidden" : "bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300") }>
                            { !isPDF(file) && <Link prefetch={false} href={file.src} target="_blank" className="text-center cursor-pointer" style={{width:"90%"}}>
                                <p className="text-white text-sm overflow-hidden text-ellipsis">{file.Key.split("/").pop()}</p>
                            </Link> }
                            </div>
                            { isPDF(file) && <Link prefetch={false} href={file.src} target="_blank" className="text-center cursor-pointer" style={{width:"90%"}}>
                                <p className=" text-sm overflow-hidden text-ellipsis">{file.Key.split("/").pop()}</p>
                            </Link> }
                            { !isPDF(file) && <p className="text-center text-sm overflow-hidden text-ellipsis">{file.Key.split("/").pop()}</p> }
                        </div>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}
export default memo(FileGallery)