/**
 * Secure Storage Service
 * SECURITY: Implements presigned URLs for MinIO to prevent public bucket exposure
 * All file access requires time-limited signed URLs
 * Replaces Epic E1-T4 with secure implementation
 */

import { minioClient } from '../config/minio.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';
import path from 'path';

/**
 * Bucket names from environment
 */
const BUCKETS = {
  DOCUMENTS: process.env.MINIO_BUCKET_DOCUMENTS || 'furnacelog-documents',
  IMAGES: process.env.MINIO_BUCKET_IMAGES || 'furnacelog-images',
  AVATARS: process.env.MINIO_BUCKET_AVATARS || 'furnacelog-avatars'
};

/**
 * Allowed MIME types for each bucket
 * SECURITY: Prevents upload of executable files
 */
const ALLOWED_TYPES = {
  [BUCKETS.DOCUMENTS]: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ],
  [BUCKETS.IMAGES]: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ],
  [BUCKETS.AVATARS]: [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
};

/**
 * File magic numbers (file signatures) for validation
 * SECURITY: Validates files by content, not just extension
 */
const MAGIC_NUMBERS = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]]
};

/**
 * Validate file type using magic numbers
 * SECURITY: Prevents upload of disguised executable files
 */
function validateFileSignature(buffer, mimeType) {
  const signatures = MAGIC_NUMBERS[mimeType];
  if (!signatures) {
    return true; // Allow if no signature defined
  }

  return signatures.some(signature => {
    return signature.every((byte, index) => buffer[index] === byte);
  });
}

/**
 * Sanitize filename to prevent path traversal
 * SECURITY: Removes directory components and dangerous characters
 */
function sanitizeFilename(filename) {
  const basename = path.basename(filename);
  const safe = basename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return safe;
}

/**
 * Generate unique filename to prevent overwrites
 * SECURITY: Uses UUID to prevent filename guessing
 */
function generateUniqueFilename(originalFilename, userId) {
  const ext = path.extname(sanitizeFilename(originalFilename));
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  return `${userId}_${timestamp}_${uuid}${ext}`;
}

/**
 * Upload file to object storage
 * @param {Buffer} fileBuffer - File data
 * @param {string} filePath - Original filename
 * @param {string} contentType - MIME type
 * @param {string} userId - User ID
 */
export const uploadToStorage = async (fileBuffer, filePath, contentType, userId = 'system') => {
  const bucket = BUCKETS.DOCUMENTS; // Default bucket
  const result = await uploadFile(fileBuffer, filePath, contentType, bucket, userId);

  // Return presigned URL valid for 24 hours
  const url = await getPresignedDownloadUrl(bucket, result.objectName, 86400);
  return url;
};

/**
 * Upload file to MinIO with security checks
 */
export async function uploadFile(fileBuffer, originalFilename, mimeType, bucket, userId) {
  try {
    if (!Object.values(BUCKETS).includes(bucket)) {
      throw new Error(`Invalid bucket: ${bucket}`);
    }

    const allowedTypes = ALLOWED_TYPES[bucket];
    if (!allowedTypes || !allowedTypes.includes(mimeType)) {
      throw new Error(`File type ${mimeType} not allowed in bucket ${bucket}`);
    }

    if (!validateFileSignature(fileBuffer, mimeType)) {
      logger.warn(`SECURITY: File signature mismatch for ${mimeType}`, { userId });
      throw new Error('File content does not match declared type');
    }

    const filename = generateUniqueFilename(originalFilename, userId);
    const objectName = `${userId}/${filename}`;

    const bucketExists = await minioClient.bucketExists(bucket);
    if (!bucketExists) {
      await minioClient.makeBucket(bucket);
      logger.info(`Created bucket: ${bucket}`);
    }

    const metadata = {
      'Content-Type': mimeType,
      'X-Upload-User': userId,
      'X-Upload-Time': new Date().toISOString()
    };

    await minioClient.putObject(bucket, objectName, fileBuffer, fileBuffer.length, metadata);
    logger.info(`File uploaded: ${bucket}/${objectName}`, { userId });

    return {
      bucket,
      objectName,
      filename,
      size: fileBuffer.length,
      mimeType
    };
  } catch (error) {
    logger.error(`File upload failed: ${error.message}`, { userId, bucket });
    throw error;
  }
}

/**
 * Generate presigned URL for file download
 * SECURITY: Time-limited URL, no permanent public access
 */
export async function getPresignedDownloadUrl(bucket, objectName, expirySeconds = 3600) {
  try {
    if (!Object.values(BUCKETS).includes(bucket)) {
      throw new Error(`Invalid bucket: ${bucket}`);
    }

    const safeName = objectName.replace(/\.\./g, '');
    const url = await minioClient.presignedGetObject(bucket, safeName, expirySeconds);

    logger.debug(`Generated presigned download URL for ${bucket}/${safeName}`);
    return url;
  } catch (error) {
    logger.error(`Failed to generate presigned URL: ${error.message}`);
    throw error;
  }
}

/**
 * Generate presigned URL for file upload (direct browser upload)
 */
export async function getPresignedUploadUrl(bucket, objectName, expirySeconds = 900) {
  try {
    if (!Object.values(BUCKETS).includes(bucket)) {
      throw new Error(`Invalid bucket: ${bucket}`);
    }

    const safeName = objectName.replace(/\.\./g, '');
    const url = await minioClient.presignedPutObject(bucket, safeName, expirySeconds);

    logger.debug(`Generated presigned upload URL for ${bucket}/${safeName}`);
    return url;
  } catch (error) {
    logger.error(`Failed to generate presigned upload URL: ${error.message}`);
    throw error;
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket, objectName, userId) {
  try {
    if (!objectName.startsWith(`${userId}/`)) {
      logger.warn(`SECURITY: User ${userId} attempted to delete file not owned: ${objectName}`);
      throw new Error('Unauthorized: Cannot delete file belonging to another user');
    }

    await minioClient.removeObject(bucket, objectName);
    logger.info(`File deleted: ${bucket}/${objectName}`, { userId });
    return true;
  } catch (error) {
    logger.error(`File deletion failed: ${error.message}`);
    throw error;
  }
}

export default {
  uploadToStorage,
  uploadFile,
  getPresignedDownloadUrl,
  getPresignedUploadUrl,
  deleteFile,
  BUCKETS
};
