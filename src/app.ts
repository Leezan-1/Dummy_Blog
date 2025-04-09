import resolve from "path";
import express, { Request, Response } from 'express';
// import cookieparser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieparser(process.env.COOKIE_SECRET));

app.use(async (req: Request, res: Response) => {
    
 });

export { }