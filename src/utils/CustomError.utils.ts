import { ZodError } from "zod";

export default class CustomError extends Error {
    code: number;
    errObj: object | ZodError

    constructor(statusCode: number, message: string, err?: object | ZodError) {
        super(message)
        this.code = statusCode;

        this.errObj = err!
    }
}