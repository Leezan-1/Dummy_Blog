const { MulterError } = require("multer");
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

    if (!(err instanceof CustomError)) {
        if (err instanceof MulterError)
            return res.status(406).json(ApiResponse.failure(406, null, err));
        console.log('err :>> ', err);
        return res.status(500).json(ApiResponse.failure(500, null, err));
    }

    res.status(statusCode).json(ApiResponse.failure(statusCode, message, err));
};

module.exports = errorHandlerMW;