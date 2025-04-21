import path from 'path';
import crypto from 'crypto';
import CustomError from '../utils/CustomError.utils';
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (allowedTypes.includes(file.mimetype))
        cb(null, true);
    else
        cb(new CustomError(406, "file error: only image type files are allowed"));
};

const blogImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = path.resolve(__dirname, "../public/uploads/blog_images");
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        crypto.randomBytes(8, (err, buffer) => {
            let filename = buffer.toString("hex") + "-" + file.originalname;
            if (err)
                cb(err, filename);
            else
                cb(null, filename);
        })
    }
});

const userImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = path.resolve(__dirname, "../public/uploads/blog_images");
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        crypto.randomBytes(8, (err, buffer) => {
            let filename = buffer.toString("hex") + "-" + file.originalname;
            if (err)
                cb(err, filename);
            else
                cb(null, filename);
        })
    }
});

export const uploadPostImage = multer({
    storage: blogImageStorage,
    fileFilter: imageFileFilter,
    limits: {

        // limits 5MB size for blog post image
        fileSize: 5 * 1024 * 1024,
    }
});

export const uploadUserImage = multer({
    storage: userImageStorage,
    fileFilter: imageFileFilter,
    limits: {

        // limits 3MB size for user profile image
        fileSize: 5 * 1024 * 1024
    }
});