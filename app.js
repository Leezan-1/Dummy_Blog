const express = require("express");
const app = express();

const authRouter = require('./routes/authRoute');

app.use(express.json());


app.use('/auth', authRouter);

app.use(async (req, res) => {
    res.status(404).send('404! Route Not Found!');
});

app.use(async (err, req, res, next) => {
    if (err)
        console.log('error :>> ', err);

    res.status(500).send('Internal Server error', err);
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} ✅`);
})
