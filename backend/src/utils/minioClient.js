import { Client } from 'minio';
import crypto from 'crypto';
import path from 'path';

// Initialize MinIO client
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

// Bucket names
const BUCKETS = {
  IMAGES: 'images',
  DOCUMENTS: 'documents',
  AVATARS: 'avatars'
};

/**
 * Initialize buckets if they don't exist
 */
export const initializeBuckets = async () => {
  try {
    for (const bucket of Object.values(BUCKETS)) {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket, 'us-east-1');
        console.log(`Created MinIO bucket: ${bucket}`);
        
        // Set bucket policy to allow public read for images
        if (bucket === BUCKETS.IMAGES) {
          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucket}/*`]
              }
            ]
          };
          await minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
        }
      }
    }
  } catch (error) {
    console.error('Error initializing MinIO buckets:', error);
  }
};

/**
 * Generate unique filename with timestamp and random string
 */
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName);
  return `${timestamp}-${randomString}${extension}`;
};

/**
 * Upload file to MinIO
 */
export const uploadFile = async (file, bucketName = BUCKETS.IMAGES, folder = '') => {
  try {
    const fileName = generateFileName(file.originalname);
    const objectName = folder ? `${folder}/${fileName}` : fileName;
    
    // Upload file buffer to MinIO
    await minioClient.putObject(
      bucketName,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype
      }
    );

    // Generate URL
    const url = `${process.env.MINIO_PUBLIC_URL || 'http://localhost:9000'}/${bucketName}/${objectName}`;
    
    return {
      url,
      bucket: bucketName,
      objectName,
      size: file.size,
      mimetype: file.mimetype
    };
  } catch (error) {
    console.error('MinIO upload error:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Delete file from MinIO
 */
export const deleteFile = async (bucketName, objectName) => {
  try {
    await minioClient.removeObject(bucketName, objectName);
    return true;
  } catch (error) {
    console.error('MinIO delete error:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Get file URL
 */
export const getFileUrl = async (bucketName, objectName, expirySeconds = 7 * 24 * 60 * 60) => {
  try {
    return await minioClient.presignedGetObject(bucketName, objectName, expirySeconds);
  } catch (error) {
    console.error('MinIO get URL error:', error);
    throw new Error('Failed to get file URL');
  }
};

/**
 * List files in bucket
 */
export const listFiles = async (bucketName, prefix = '') => {
  try {
    const stream = minioClient.listObjects(bucketName, prefix, true);
    const files = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => files.push(obj));
      stream.on('error', reject);
      stream.on('end', () => resolve(files));
    });
  } catch (error) {
    console.error('MinIO list error:', error);
    throw new Error('Failed to list files');
  }
};

export { BUCKETS, minioClient };
export default { 
  initializeBuckets, 
  uploadFile, 
  deleteFile, 
  getFileUrl, 
  listFiles,
  BUCKETS,
  minioClient 
};
