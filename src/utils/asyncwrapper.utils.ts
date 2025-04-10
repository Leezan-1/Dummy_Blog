import { NextFunction, Request, Response } from "express";
import { FunctionWrapper } from "../interfaces/FunctionWrapper";


export const wrapRequestFunction: FunctionWrapper = (controllerFunction) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await controllerFunction(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}