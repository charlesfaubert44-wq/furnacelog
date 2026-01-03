/**
 * Storage Service
 * Placeholder for MinIO/S3 file storage
 * To be fully implemented in Epic E1-T4
 */

/**
 * Upload file to object storage
 * @param {Buffer} fileBuffer - File data
 * @param {string} filePath - Destination path in storage
 * @param {string} contentType - MIME type
 */
export const uploadToStorage = async (fileBuffer, filePath, contentType) => {
  // Placeholder implementation
  console.log('File would be uploaded to storage:', {
    filePath,
    contentType,
    size: fileBuffer.length
  });

  // TODO: Implement with MinIO client in E1-T4
  return `https://storage.furnacelog.com/${filePath}`;
};

export default { uploadToStorage };
