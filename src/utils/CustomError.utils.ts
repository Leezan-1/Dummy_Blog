// configs and resources
import { ZodError } from "zod";

export default class CustomError extends Error {
    code: number;
    errorObj: object;

    constructor(statusCode: number, message: string, error?: ZodError) {
        super(message)
        this.code = statusCode;

        if (error instanceof ZodError) {
            this.errorObj = error.errors.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
        }
        this.errorObj = error!
    }
}