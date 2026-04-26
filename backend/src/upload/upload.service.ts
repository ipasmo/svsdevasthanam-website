import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    const endpoint = process.env.AWS_S3_ENDPOINT;
    this.s3 = new S3Client({
      region: process.env.AWS_REGION ?? 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      ...(endpoint && { endpoint, forcePathStyle: true }),
    });
    this.bucket = process.env.AWS_S3_BUCKET ?? 'svs-devastanam-media';
  }

  async uploadFile(file: Express.Multer.File, folder = 'gallery'): Promise<{ key: string; url: string }> {
    if (!file) throw new BadRequestException('No file provided');
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${uuidv4()}.${ext}`;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      },
    });
    await upload.done();

    const endpoint = process.env.AWS_S3_ENDPOINT;
    const url = endpoint
      ? `${endpoint}/${this.bucket}/${key}`
      : `https://${this.bucket}.s3.${process.env.AWS_REGION ?? 'ap-south-1'}.amazonaws.com/${key}`;

    return { key, url };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    return getSignedUrl(this.s3, new GetObjectCommand({ Bucket: this.bucket, Key: key }), { expiresIn });
  }
}
