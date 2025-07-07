"use client"

import { getS3FolderFilesQueryApi } from "@/components/api/awsApi";
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@workspace/ui/components/accordion";
import { useCallback } from "react";

export default function PageClient() {
  const folderPath = ["faq","buyer"].join("/")
    const {data: awsFiles } = useQuery({
        queryKey: ["s3-files", folderPath ],
        queryFn: async() => await getS3FolderFilesQueryApi(folderPath)
    })

    const shouldDisplayVideo = useCallback( (file:any) =>{
        let ext = file.Key.toLowerCase().split(".").pop()
        return ["mp4", "mov", "avi", "wmv", "flv", "webm", "mkv", "m4v"].includes(ext)
    },[])

  return (
    <div className="w-full p-2 md:p-4">
      <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="mb-6">Here are some common questions and answers to help you.</p>
      <Accordion type="single" collapsible>
        {
          awsFiles?.map((file:any, index:number) => {
            if(file.Key.endsWith("/")) return null; // Skip folders
            const question = file.Key.split(folderPath).pop()
            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{question?.replace("/","")?.replace(".mp4","")}</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-100 rounded-md">
                    {
                        shouldDisplayVideo(file) && <video
                            className="w-full h-full object-cover rounded shadow-md"
                            controls
                            src={file.src}
                            style={{border:"none"}}
                            autoPlay={true}
                        >
                            Your browser does not support the video tag.
                        </video>
                    }
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })
        }
    </Accordion>
    </div>
  );
}



