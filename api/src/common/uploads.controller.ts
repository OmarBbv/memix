import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { multerConfig } from './utils/multer.config';

@Controller('uploads')
export class UploadsController {
  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), // 10MB limit
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }), // Yalnız şəkillər
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // URL-i qaytarırıq ki, frontend istifadə edə bilsin
    // Məsələn: http://localhost:3000/uploads/file-123456789.png
    const fileUrl = `/uploads/${file.filename}`;
    return {
      originalname: file.originalname,
      filename: file.filename,
      url: fileUrl,
    };
  }
}
