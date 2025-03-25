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

// MIDDLEWARES.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser(process.env.COOKIE_SECRET));

// ROUTES using Routers
// routes that handles user login and session authentication
app.use('/auth', authRouter);

// routes that handles blog post management
app.use('/api/blogs', blogsRouter);
app.use('/api/tags', tagsRouter);

// Serving static files
const publicDir = path.resolve(__dirname, 'public');
app.use('/public', express.static(publicDir));

// 404 PAGE
app.use(async (req, res) => {
    res.status(404).send('404! Route Not Found!');
});


// ERROR MIDDLEWARE
app.use(errorHandlerMW);

module.exports = app;


