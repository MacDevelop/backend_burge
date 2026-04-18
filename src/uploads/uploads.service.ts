import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {
    const cloudinaryUrl = this.configService.get('CLOUDINARY_URL');
    if (cloudinaryUrl) {
      cloudinary.config({ cloudinary_url: cloudinaryUrl });
    } else {
      throw new Error('CLOUDINARY_URL not found in environment variables');
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );
      uploadStream.end(file.buffer);
    });
  }
}