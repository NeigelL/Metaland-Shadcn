import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { isLogin } from "@/lib/nextAuthOptions"
import s3Client from "@/lib/aws"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { logAccessService } from "@/services/accessService"

export async function POST(req: NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }
  await logAccessService({
    request: req,
    metadata: {
      action: "BUYER UPLOAD PROOF",
      description: "Request to get signed URL for S3 upload"
    }
  })


  const { fileName, fileType, createFolder = false } = await req.json();

  if (!fileName || !fileType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }


  try {
    let finalName = fileName
    if(createFolder){
      let tempDirectory = finalName.split("/")
      let tempFileName = tempDirectory.pop()
      finalName =  tempDirectory.join("/")  + "/" + createFolder +  "/" + tempFileName
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: tempDirectory.join("/")  + "/" + createFolder + "/",
        Body: "",
      }))
    }
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: finalName,
        ContentType: fileType,
      })
      const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 })

      return NextResponse.json({ uploadURL });
  } catch (error) {
    return NextResponse.json({ error: "Error generating signed URL" }, { status: 500 })
  }
}
