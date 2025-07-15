import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand, S3Client, waitUntilObjectNotExists } from "@aws-sdk/client-s3"
import s3Client from "@/lib/aws";
import { WaiterConfiguration } from "@smithy/util-waiter";
import dbConnect from "@/lib/mongodb";
import { isLogin } from "@/lib/nextAuthOptions";
import { logAccessService } from "@/services/accessService";

export async function GET(request: NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  const url = new URL(request.url)
  const searchParams = url.searchParams
  const key = searchParams.get("key") || ""
  const bucketName = process.env.AWS_S3_BUCKET_NAME!

  try {

    await logAccessService({
      request,
      metadata : { action: "DELETE BUYER S3 FILES", file: key, bucket: bucketName },
    })

    const deleteObject = await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        }),
      )

    const waiterClient: WaiterConfiguration<S3Client> = {client: s3Client, maxWaitTime: 1000}

    const notExists = await waitUntilObjectNotExists(
          waiterClient,
        { Bucket: bucketName, Key: key },
      )

    return NextResponse.json( {'deleted':'successfully'} );
  } catch (error) {
    console.error("S3 List Error:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
