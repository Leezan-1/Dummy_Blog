
// creating an express application
const express = require("express");
const app = express();
const cookieparser = require('cookie-parser');

// ROUTERS.
const authRouter = require('./routes/authRoute');
const blogsRouter = require('./routes/blogsRoute');
const CustomError = require('./utils/CustomError');
const ApiResponse = require("./utils/apiMessage");
// MIDDLEWARES.
app.use(express.json());
app.use(cookieparser());

// ROUTES using Routers
app.use('/auth', authRouter);
app.use('/blogs', blogsRouter);

// 404 PAGE
app.use(async (req, res) => {
    res.status(404).send('404! Route Not Found!');
});

// ERROR MIDDLEWARE
app.use(async (err, req, res, next) => {
    let { message, statusCode } = err;

    if (!(err instanceof CustomError)) {
        console.log('error :>> ', err);
        return res.status(500).json(ApiResponse.failure(500, null, err));
    }

    res.status(statusCode).json(ApiResponse.failure(statusCode, message, err));
})

module.exports = app;


