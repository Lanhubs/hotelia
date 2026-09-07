import { Context } from 'hono';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

// Configure Cloudinary SDK with credentials from config/env
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

class UploadController {
  async upload(c: Context): Promise<Response> {
    try {
      const formData = await c.req.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof Blob)) {
        return c.json({ error: 'No valid file provided' }, 400);
      }

      // Convert incoming File/Blob to ArrayBuffer & Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload using official Cloudinary Node.js SDK upload_stream
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'keo_hotel_rooms',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(buffer);
      });

      return c.json({
        url: uploadResult.secure_url || uploadResult.url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        width: uploadResult.width,
        height: uploadResult.height,
      });
    } catch (error: any) {
      console.error('Cloudinary SDK upload error:', error);
      return c.json({ error: error.message || 'Internal upload error' }, 500);
    }
  }
}

export default new UploadController();
