import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

let client: S3Client | null = null;

function getR2Client() {
  if (client) return client;

  const accountId = requiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = requiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requiredEnv("R2_SECRET_ACCESS_KEY");

  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return client;
}

function publicBaseUrl() {
  return requiredEnv("R2_PUBLIC_URL").replace(/\/+$/, "");
}

export async function uploadToR2(input: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const bucket = requiredEnv("R2_BUCKET_NAME");
  const s3 = getR2Client();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${publicBaseUrl()}/${input.key}`;
}
