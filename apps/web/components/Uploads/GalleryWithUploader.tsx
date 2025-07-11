import { useCallback, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import UppyMultipartUploader from "./UppyUploaderMultipart";
import { getS3FolderFilesQueryApi } from "../api/awsApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "@workspace/ui/components/loader";

export default function GalleryWithUploader(
    {
        options : { folder="", entityID = "", collection = "", label = "Files"},
        onCompleteCallback = (f:any) => {},
        createFolderProp = null,

}   : any) {

    const [files, setFiles] = useState([])
    const [folders, setFolders] = useState([])
    const [filesRequesting, setFilesRequesting] = useState(true)
    const [folderPath, setFolderPath] = useState(folder)

        const {data: awsFiles, refetch: onCompleteCallbackBase } = useQuery({
        queryKey: ["s3-files", folderPath],
        queryFn: async() => await getS3FolderFilesQueryApi(folderPath)
    })

    useEffect(() => {
        if(awsFiles) {
            let tempFolders:any = []
            let tempFiles:any = []
            awsFiles?.map( (file:any, key:any) => {
                if( file.Key[file.Key.length-1] === "/" ) {
                    tempFolders.push(file)
                } else {
                    let removedPrefix = file.Key.split(folderPath + "/")
                    if(removedPrefix?.length > 1 && !removedPrefix?.pop()?.includes("/") ) {
                        tempFiles.push(file)
                    }
                }
            })
            setFiles(tempFiles)
            setFolders(tempFolders)
            setFilesRequesting(false)
            onCompleteCallback(folderPath)
        }
    }, [awsFiles])

    useEffect(() => {
        onCompleteCallbackBase(folderPath)
    }, [folderPath])

    const shouldDisplayImage = useCallback( (file:any) =>{
        let ext = file.Key.toLowerCase().split(".").pop()
        return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)
    },[])

    const shouldDisplayPDF = useCallback( (file:any) =>{
        let ext = file.Key.toLowerCase().split(".").pop()
        return ["pdf"].includes(ext)
    },[])

    const shouldDisplayVideo = useCallback( (file:any) =>{
        let ext = file.Key.toLowerCase().split(".").pop()
        return ["mp4", "mov", "avi", "wmv", "flv", "webm", "mkv", "m4v"].includes(ext)
    },[])

    return (
        <>
            {!filesRequesting && files.length == 0 && <h4 className="text-2xl font-bold mb-6 mt-2">No {label}</h4>}
            {filesRequesting && files.length == 0 && <h4 className="text-2xl font-bold mb-6"><Loader/></h4>}
            {/* { folders.length > 0 &&
                <div className="container mx-auto p-2">
                    <h4 className="text-2xl font-bold mb-6">Folders <span className="text-xs">in :{folderPath}</span></h4>

                    {
                        folder !== folderPath && <div className="mt-4 mb-4">
                        <Link href="#" onClick={
                            (e:any) => {
                                e.preventDefault()
                                let f = folderPath.split("/")
                                f.pop()
                                setFolderPath( f.join("/") )
                            }
                        } >{SidebarIcon('left-arrow')}</Link>
                    </div>
                    }

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {folders.map((file:any) => {
                            let folderArr = file.Key.split("/")
                            let folderName = folderArr[folderArr.length - 2]
                        return  file.Key !==  folderPath+"/" && <div
                            key={file.Key} className="relative group"
                            onClick={ (e:any) => {
                                e.preventDefault()
                                let f = file.Key.split("")
                                f.pop()
                                setFolderPath( f.join("") )
                            }}
                            onDoubleClick={ (e:any) => {
                                if(confirm('Are you sure you want to delete' + file.Key.split("/").pop() + "? " )) {
                                    s3DeleteObjectApi(file.Key, (res:any) => {
                                        onCompleteCallbackBase(folder)
                                    })
                                }
                            }}
                        >
                            <p className={"text-center font-semibold " + (file.Key !==  folderPath+"/" ? "cursor-pointer" : "") }>{folderName}</p>
                        </div>
                        })}
                    </div>
                </div>
            } */}

            {files.length > 0 &&
                <div className="container mx-auto p-2">
                    <h4 className="text-2xl font-bold mb-6">{label}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {files.map((file:any) => (
                        <div key={file.Key} className="relative group" onDoubleClick={ (e:any) => {
                            if(confirm('Are you sure you want to delete' + file.Key.split("/").pop() + "? " )) {
                                // s3DeleteObjectApi(file.Key, (res:any) => {
                                //     onCompleteCallbackBase(folder)
                                // })
                            }
                        }}>
                                {shouldDisplayImage(file) && <LazyLoadImage
                                        alt={file.alt}
                                        className="w-full h-48 object-cover rounded shadow-md"
                                        wrapperProps={{
                                            style: {transitionDelay: "1s"},
                                        }}
                                        src={file.src} />}
                                {
                                    shouldDisplayPDF(file) && <div className="w-full h-48 object-cover rounded shadow-md">
                                        <iframe
                                            src={file.src}
                                            className="w-full h-full"
                                            style={{border:"none"}}
                                            title={file.Key.split("/").pop()}/>
                                    </div>
                                }
                                {
                                    shouldDisplayVideo(file) && <video
                                        className="w-full h-58 object-cover rounded shadow-md"
                                        controls
                                        src={file.src}
                                        style={{border:"none"}}
                                        autoPlay={false}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                }
                            <div className="cursor-pointer absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <Link href={file.src} target="_blank" className="cursor-pointer text-center" style={{width:"90%"}}>
                                <p className="text-white text-sm overflow-hidden text-ellipsis">{file.Key.split("/").pop()}</p>
                            </Link>
                            </div>
                            <p className="text-center text-sm overflow-hidden text-ellipsis">{file.Key.split("/").pop()}</p>
                        </div>
                        ))}
                    </div>
                </div>
            }

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row pb-10">
                <UppyMultipartUploader
                options={ { folder : folderPath, entityID: entityID, collection: collection } }
                onCompleteCallback={  () => onCompleteCallbackBase(folderPath) }
                createFolderProp={createFolderProp}
                />
            </div>
        </>
    )
}