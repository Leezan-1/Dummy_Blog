require('dotenv').config();
const path = require("path");
// creating an express application
const express = require("express");
const app = express();

// importing cookie-parser
const cookieparser = require('cookie-parser');

// this middleware handles error for whole application
const errorHandlerMW = require("./middlewares/errorMiddleware");

// ROUTERS.
const authRouter = require('./routes/authRoute');
const blogsRouter = require('./routes/blogsRoute');
const tagsRouter = require('./routes/tagsRoute');
const usersRouter = require('./routes/usersRoute');

// MIDDLEWARES.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser(process.env.COOKIE_SECRET));

// ROUTES using Routers
// routes that handles user login and session authentication
app.use('/v1/api/auth', authRouter);

// routes that handles blog post management
app.use('/v1/api/blogs', blogsRouter);
app.use('/v1/api/tags', tagsRouter);

app.use('/v1/api/users', usersRouter);
// Serving static files
const publicDir = path.resolve(__dirname, 'public');
app.use('/public', express.static(publicDir));

// 404 PAGE
app.use(async (req, res) => {
    let toResponse = {
        code: 404,
        success: false,
        message: "Not Found",
        error: {
            reason: "Route not found!",
            message: "Page you are trying to access does not exist!"
        }
    }
    res.status(404).json(toResponse);
});


// ERROR MIDDLEWARE
app.use(errorHandlerMW);

module.exports = app;


