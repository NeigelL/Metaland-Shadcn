import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command, GetObjectCommand} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import s3Client from "@/lib/aws";
import dbConnect from "@/lib/mongodb";
import { isLogin } from "@/lib/nextAuthOptions";

export async function GET(request: NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const folder = searchParams.get("folder") || "";
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  

  try {
    if(!folder) {
      return NextResponse.json({ error: "Folder parameter is required" + folder }, { status: 400 });
    }
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folder,
    })

    const response = await s3Client.send(command)
    let files:any = []
    let contents =  response?.Contents

    if(contents) {

      await Promise.all(
          contents.map( async(file:any) => {
          const fileCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key : file.Key
          })

          const signedUrl = await getSignedUrl(s3Client, fileCommand, {
            expiresIn: 3600, // URL valid for 1 hour
          })
          files.push({
            ...file,
            url: signedUrl,
            src: signedUrl,
            alt: file.Key,
            title: file.Key
          })
        })
      )

    }
    return NextResponse.json( files );
  } catch (error) {
    console.error("S3 List Error:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
