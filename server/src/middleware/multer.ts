import { Request } from 'express';
import multer from 'multer';
import path from 'path';

const fileStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, './uploads');
      // cb(null, path.join(__dirname,'../../public/uploads/'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const fileFilter = (req: Request, file: any, cb: any) => {
    cb(null, true);
};

  export const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
  });
