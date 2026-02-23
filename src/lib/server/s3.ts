import { S3Client } from "@aws-sdk/client-s3";
import {
	S3_ACCESS_KEY,
	S3_ENDPOINT,
	S3_REGION,
	S3_SECRET_KEY,
	S3_BUCKET_NAME,
	S3_CDN_URL,
} from "$env/static/private";

export const s3Client = new S3Client({
	endpoint: S3_ENDPOINT,
	region: S3_REGION || "us-east-1",
	credentials: {
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_KEY,
	},
	forcePathStyle: true,
});

export const bucketName = S3_BUCKET_NAME;
export const cdnUrl = S3_CDN_URL || "https://media.sewercomedy.fun";
