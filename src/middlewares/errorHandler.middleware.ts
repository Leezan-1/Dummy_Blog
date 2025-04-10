import { NextFunction, Request, Response } from 'express';


const errorHandlerMW = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("apple");
    res.status(500).json({ apple: "apple" });
};

export default errorHandlerMW;