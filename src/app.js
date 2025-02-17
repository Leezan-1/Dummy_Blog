
// creating an express application
const express = require("express");
const app = express();

// ROUTERS.
const authRouter = require('./routes/authRoute');
const blogsRouter = require('./routes/blogsRoute');

// MIDDLEWARES.
app.use(express.json());

// ROUTES using Routers
app.use('/auth', authRouter);
app.use('/blogs', blogsRouter);

// 404 PAGE
app.use(async (req, res) => {
    res.status(404).send('404! Route Not Found!');
});

// ERROR MIDDLEWARE
app.use(async (err, req, res, next) => {
    if (err)
        console.log('error :>> ', err);

    res.status(500).send('Internal Server error', err);
})

module.exports = app;


