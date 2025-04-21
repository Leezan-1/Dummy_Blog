// in-built modules
import { MulterError } from 'multer';
import { BaseError } from 'sequelize';
import { JsonWebTokenError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

// utils modules
import { apiFailureMsg } from '../utils/apiMessage.utils';
import CustomError from '../utils/CustomError.utils';
import deleteImageFile from '../utils/deleteImageFile.utils';


const errorHandlerMW = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    let responseCode: number = 500, errMsg: string = "server error";


    if (req.files && typeof req.files === 'object') {
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };

        // loops to 2 different fields like 'blog-images' and 'thumbnail-image'
        for (const fileArray of Object.values(filesObj)) {
            for (const file of fileArray) {
                await deleteImageFile(file.path);
            }
        }
    }
    if (req.file) {
        await deleteImageFile(req.file.path);
    }

    // handles different types of error
    if (error instanceof CustomError)
        responseCode = error.code, errMsg = error.message;

    else if (error instanceof MulterError)
        responseCode = 406, errMsg = "multer error";

    else if (error instanceof JsonWebTokenError)
        responseCode = 400, errMsg = "token error";

    else if (error instanceof BaseError)
        errMsg = "database error";

    console.log(errMsg, ":\n", error);
    res.status(responseCode).json(apiFailureMsg(responseCode, errMsg, error));
};

export default errorHandlerMW;