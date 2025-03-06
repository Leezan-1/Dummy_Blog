
// creating an express application
const express = require("express");
const app = express();
const cookieparser = require('cookie-parser');
const errorHandlerMW = require("./middlewares/errorMiddleware");

// ROUTERS.
const authRouter = require('./routes/authRoute');
const blogsRouter = require('./routes/blogsRoute');

// MIDDLEWARES.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());

// ROUTES using Routers
app.use('/auth', authRouter);
app.use('/blogs', blogsRouter);

app.use('/public', express.static('public'));

// 404 PAGE
app.use(async (req, res) => {
    res.status(404).send('404! Route Not Found!');
});


// ERROR MIDDLEWARE
app.use(errorHandlerMW);

module.exports = app;


