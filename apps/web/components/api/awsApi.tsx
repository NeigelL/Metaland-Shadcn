"use client"
import { API_URL } from "@/serverConstant"
import axios from "axios"

export const getS3FolderFilesQueryApi = async(key:any) => {
    // await requestApi( API_URL.S3_FILES + "?folder=" + key ,  callback )
    return (await axios.get(API_URL.S3_FILES.index + "?folder=" + key)).data
}

export const postAmortizationIndexQueryApi = async(query:any = "*", signal:any)  => {
    return (await axios.post(API_URL.RESERVATION.index, {...query}, {signal})).data
}
export const s3DeleteObjectQueryApi = async(key:any, callback:any) => {
     const resp =  (await axios.get(API_URL.S3_FILES.delete + "?key=" + key)).data
     if(resp) {
        callback(resp)
     }
}
