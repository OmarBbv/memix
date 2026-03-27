import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: join(process.cwd(), 'uploads'),
    filename: (req: any, file: any, callback: any) => {
      console.log('Multer is processing file:', file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req: any, file: any, callback: any) => {
    console.log(
      'Multer fileFilter for:',
      file.originalname,
      'mimetype:',
      file.mimetype,
    );
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      return callback(
        new HttpException(
          'Yalnız şəkil faylları (jpg, png, webp, gif) icazəlidir!',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
};
