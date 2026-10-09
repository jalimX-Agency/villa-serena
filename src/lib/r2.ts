import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// R2_ENDPOINT holds the public r2.dev base URL (not the S3 API endpoint),
// so the S3 endpoint is derived from the account id.
const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME ?? "";
const PUBLIC_BASE = (process.env.R2_ENDPOINT ?? "").replace(/\/$/, "");

export function publicUrl(key: string) {
  return `${PUBLIC_BASE}/${key}`;
}

export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return publicUrl(key);
}

export async function deleteFromR2(url: string) {
  if (!PUBLIC_BASE || !url.startsWith(PUBLIC_BASE)) return;
  const key = url.slice(PUBLIC_BASE.length + 1);
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
