import { NextFunction, Request, RequestHandler, Response } from "express";
import AuthenticatedRequest from "./AuthenticatedRequest.interface";

interface RequestFunction {
    (req: Request | AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>
}

export interface FunctionWrapper {
    (fn: RequestFunction): RequestHandler
}