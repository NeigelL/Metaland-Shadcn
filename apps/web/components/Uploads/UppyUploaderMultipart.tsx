"use client";

import React from "react";
import Uppy, { Body, Meta } from "@uppy/core";
import AwsS3Multipart from "@uppy/aws-s3";
import { Dashboard } from "@uppy/react";
import { toast } from "sonner"
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

const UppyMultipartUploader = ({options : { folder="", entityID = "", collection = ""} , onCompleteCallback = () => {}, createFolderProp = null  } : any) => {
  const uppy = new Uppy<Meta, Body>({
    restrictions: {
      maxFileSize: 0,
      maxNumberOfFiles: 100
    },
    autoProceed: false,
  })
// @ts-ignore 
  uppy.use(AwsS3Multipart, {
    getUploadParameters: async(file:any) => {
      const response = await fetch("/api/s3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...file,
          createFolder: createFolderProp,
          fileName: file.meta.folder + "/" + file.name,
          fileType: file.type,
        })
      })

      // if (!response.ok) {
      //   toast.error("Failed to get upload parameters");
      //   throw new Error("Failed to get upload parameters");
      // }

      const { uploadURL }: { uploadURL: string } = await response.json()
      return {
        method: "PUT",
        url: uploadURL+"",
        headers: {
          "Content-Type": file.type,
        }
      }
    },

    createMultipartUpload: async (file:any) => {
      const response = await fetch("/api/s3/multipart/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: folder + "/" + file.name, fileType: file.type }),
      });

      if (!response.ok) {
        toast.error("Failed to initiate upload");
        throw new Error("Failed to initiate upload");
      }

      const { uploadId, key } = await response.json();
      return { uploadId, key };
    },
    // getUploadPartURL: async ( { uploadId, key, partNumber }:any) => {
    //   const response = await fetch("/api/s3/multipart/signed-url", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ uploadId, key, partNumber }),
    //   });

    //   if (!response.ok) {
    //     toast.error("Failed to get signed URL for part");
    //     throw new Error("Failed to get signed URL for part");
    //   }

    //   const { signedUrl } = await response.json();
    //   return signedUrl;
    // },
    completeMultipartUpload: async ({ uploadId, key, parts }:any) => {
      const response = await fetch("/api/s3/multipart/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId, key, parts }),
      });

      if (!response.ok) {
        toast.error("Failed to complete upload");
        throw new Error("Failed to complete upload");
      }

      const { location } = await response.json();
      onCompleteCallback()

      return { location }
      // toast.success(`File uploaded successfully: ${location}`);
    }
  })

  uppy.on('file-added',(file) => {
    uppy.setFileMeta(file.id, {
      folder,
      entityID,
      collection,
      extension: uppy.getFile(file.id).extension
    })
})

uppy.on("complete", (result:any) => {
  toast.success(
      <div>
        <p className="text-sm">{result?.successful?.length}Files have been uploaded successfully.</p>
      </div>
  );
  
  onCompleteCallback()
})

//   useEffect(() => {
//     return () => uppy.close();
//   }, [uppy]);

  return (
    <div className="container mx-auto px-2">
      {/* <h1 className="mb-3 block text-sm font-medium text-black dark:text-white">Multipart File Upload</h1> */}
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        width="100%"
        height="300px"
        showProgressDetails
        note="Upload large files (Max: 100MB)"
      />
    </div>
  );
};

export default UppyMultipartUploader;
