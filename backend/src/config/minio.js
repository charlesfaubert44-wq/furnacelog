import * as Minio from 'minio';
import logger from '../utils/logger.js';

let minioClient = null;

const connectMinIO = async () => {
  try {
    minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT, 10),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });

    // Create buckets if they don't exist
    const buckets = [
      process.env.MINIO_BUCKET_DOCUMENTS || 'furnacelog-documents',
      process.env.MINIO_BUCKET_IMAGES || 'furnacelog-images',
      process.env.MINIO_BUCKET_AVATARS || 'furnacelog-avatars',
    ];

    for (const bucket of buckets) {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket, 'us-east-1');
        logger.info(`Created MinIO bucket: ${bucket}`);
        
        // Set bucket policy to allow read access for public buckets (if needed)
        // For now, keep all buckets private
      } else {
        logger.info(`MinIO bucket already exists: ${bucket}`);
      }
    }

    logger.info('MinIO connected and buckets initialized');
    return minioClient;
  } catch (error) {
    logger.error(`Error connecting to MinIO: ${error.message}`);
    // MinIO is not critical for initial development
    logger.warn('Continuing without MinIO. File upload features will be limited.');
    return null;
  }
};

const getMinIOClient = () => {
  if (!minioClient) {
    logger.warn('MinIO client not initialized');
  }
  return minioClient;
};

export { connectMinIO, getMinIOClient };
export default connectMinIO;
