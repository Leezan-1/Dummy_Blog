import { NextFunction, Request, Response } from "express";
import { FunctionWrapper } from "../interfaces/FunctionWrapper.interface";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";


const wrapRequestFunction: FunctionWrapper = (controllerFunction) => {

    return async (req: Request | AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            return await controllerFunction(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

export default wrapRequestFunction;