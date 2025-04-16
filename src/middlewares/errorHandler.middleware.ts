import { NextFunction, Request, Response } from 'express';
import { apiFailureMsg } from '../utils/apiMessage.utils';
import CustomError from '../utils/CustomError.utils';
import { BaseError } from 'sequelize';
import { JsonWebTokenError } from 'jsonwebtoken';


const errorHandlerMW = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    let responseCode: number = 500, errMsg: string = "server error";

    // handles Custom Error
    if (error instanceof CustomError)
        responseCode = error.code, errMsg = error.message;

    else if (error instanceof JsonWebTokenError)
        responseCode = 400, errMsg = "token error";

    else if (error instanceof BaseError)
        errMsg = "database error";

    console.log(errMsg, ":\n", error);
    res.status(responseCode).json(apiFailureMsg(responseCode, errMsg, error));
};

export default errorHandlerMW;