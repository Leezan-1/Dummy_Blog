// importing express and Request Response type
import express, { Request, Response } from 'express';
import path from 'path';
import cookieparser from 'cookie-parser';
// cookieparser
// Response message type.
import ResponseMessage from './interfaces/ResponseMessage';
// routers
import authRouter from './routes/auth.route';
// middlewares
import errorHandlerMW from './middlewares/errorHandler.middleware';

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser(process.env.COOKIE_SECRET));

// SERVING STATIC FILES
const publicDir: string = path.resolve(__dirname, "public");
app.use("/public", express.static(publicDir));

// ROUTES
app.use("/v1/api/auth", authRouter);
// app.use("v1/api/tags");
// app.use("v1/api/blogs");
// app.use("v1/api/users");

// 404 PAGE
app.use(async (req: Request, res: Response) => {
    const responseCode = 404;

    const responseMsg: ResponseMessage = {
        code: responseCode,
        success: false,
        message: "Not Found",
        error: {
            reason: "Route not found!",
            message: "Route you are trying to access does not exist"
        },
    };

    // console.log("404");
    res.status(responseCode).json(responseMsg);
});

// ERROR HANDLER MIDDLEWARE
app.use(errorHandlerMW);


export default app;