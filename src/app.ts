// importing built-in modules
import express from 'express';
import path from 'path';
import cookieparser from 'cookie-parser';

// routers
import authRouter from './routes/auth.route';
import tagsRouter from './routes/tags.route';
import postRouter from './routes/posts.route';
import userRouter from './routes/user.route';
import settingsRouter from './routes/settings.route';

// middlewares
import route404MW from './middlewares/route404.middleware';
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
app.use("/v1/api/tags", tagsRouter);
app.use("/v1/api/posts", postRouter);
app.use("/v1/api/users", userRouter);
app.use("/v1/api/settings", settingsRouter);

// 404 PAGE
app.use(route404MW);

// ERROR HANDLER MIDDLEWARE
app.use(errorHandlerMW);


export default app;