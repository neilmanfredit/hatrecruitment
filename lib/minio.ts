import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function getS3(): S3Client {
  return new S3Client({
    endpoint: process.env.MINIO_ENDPOINT ?? 'http://hat-recruit-minio:9000',
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'unconfigured',
      secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'unconfigured',
    },
    forcePathStyle: true,
  })
}

export const BUCKETS = {
  cvs: 'hat-recruit-cvs',
  contracts: 'hat-recruit-contracts',
  timesheets: 'hat-recruit-timesheets',
  invoices: 'hat-recruit-invoices',
} as const

export async function uploadFile(
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  await getS3().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }))
}

export async function deleteFile(bucket: string, key: string): Promise<void> {
  await getS3().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}

// Pre-signed URLs expire in 15 minutes (security-engineer S5 requirement)
export async function getPresignedUrl(bucket: string, key: string): Promise<string> {
  return getSignedUrl(getS3(), new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 900 })
}
