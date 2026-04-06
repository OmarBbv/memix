import { HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import sharp from 'sharp';

export class SharpStorage {
  constructor(private opts: any) { }

  _handleFile(req: any, file: any, cb: any) {
    const destination = this.opts.destination;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${file.fieldname}-${uniqueSuffix}.webp`;
    const finalPath = join(destination, filename);

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const outStream = fs.createWriteStream(finalPath);
    const transform = sharp()
      .resize(1200, 1200, {
        fit: 'inside',            // nisbəti qoruyur, kəsmir
        withoutEnlargement: true  // kiçik şəkilləri böyütmür
      })
      .webp({ quality: 80 });

    transform.on('error', (err) => cb(err));
    outStream.on('error', (err) => cb(err));

    file.stream.pipe(transform).pipe(outStream);

    outStream.on('finish', () => {
      cb(null, {
        destination: destination,
        filename: filename,
        path: finalPath,
        size: outStream.bytesWritten
      });
    });
  }

  _removeFile(req: any, file: any, cb: any) {
    fs.unlink(file.path, cb);
  }
}

export const multerConfig = {
  storage: new SharpStorage({
    destination: join(process.cwd(), 'uploads'),
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
