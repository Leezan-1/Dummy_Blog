import { NextFunction, Request, RequestHandler, Response } from "express";

interface RequestFunction {
    (req: Request, res: Response, next?: NextFunction): Promise<void>
}

export interface FunctionWrapper {
    (fn: RequestFunction): RequestHandler
}



