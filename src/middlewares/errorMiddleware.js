const { MulterError } = require("multer");
const SequelizeError = require("sequelize").Error;
const CustomError = require("../utils/CustomError");
const ApiResponse = require("../utils/apiMessage");

const fs = require('fs');
// ERROR MIDDLEWARE
const errorHandlerMW = async (err, req, res, next) => {
    let { message, statusCode } = err;


    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            fs.unlinkSync(file.path);
        }
    }
    if (req.file)
        fs.unlinkSync(req.file.path);


    if (err instanceof MulterError)
        return res.status(406).json(ApiResponse.failure(406, null, err));


    if (err instanceof CustomError)
        return res.status(statusCode).json(ApiResponse.failure(statusCode, message, err));

    if (err instanceof SequelizeError)
        return res.status(500).json(ApiResponse.failure(500, "Database Error", err));

    console.log('errorHandlerMW :>> ', err);
    return res.status(500).json(ApiResponse.failure(500, null, err));
};

module.exports = errorHandlerMW;