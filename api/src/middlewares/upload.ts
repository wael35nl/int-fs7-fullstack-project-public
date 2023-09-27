import { Request } from 'express';
import multer from 'multer';
import path from 'path';

const FILE_SIZE = 1024 * 1024 * 2;

const userStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/users'));
    },
    filename: (req: Request, file, cb) => {
        cb(null, file.originalname);
    }
});

const productStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/products'));
    },
    filename: (req: Request, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadUserImage = multer({ storage: userStorage, limits: { fileSize: FILE_SIZE } });
const uploadProductImage = multer({ storage: productStorage, limits: { fileSize: FILE_SIZE } });

export { uploadUserImage, uploadProductImage };