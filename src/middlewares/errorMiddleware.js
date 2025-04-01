const fs = require("fs");
const { MulterError } = require("multer");
const SequelizeError = require("sequelize").Error;
const CustomError = require("../utils/CustomError");
const ApiResponse = require("../utils/apiMessage");

// ERROR MIDDLEWARE
const errorHandlerMW = async (err, req, res, next) => {
    let { message, statusCode } = err;

    // removes multiple uploaded files from server
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            fs.unlinkSync(file.path);
        }
    }
    // removes single uploaded file form server
    if (req.file)
        fs.unlinkSync(req.file?.[0].path);

    console.log("Error:", err);
    if (err instanceof MulterError) {
        console.log("\nThis is a multer error!\n");
        return res.status(406).json(ApiResponse.failure(406, "Multer Error", err));
    }


    if (err instanceof CustomError) {
        console.log("This is a custom error!");
        return res.status(statusCode).json(ApiResponse.failure(statusCode, message, err));
    }

    if (err instanceof SequelizeError) {
        console.log('\nThis is a database error!\n');
        return res.status(500).json(ApiResponse.failure(500, "Database Error", err));
    }

    console.log('\nThis is a server error!\n ');
    return res.status(500).json(ApiResponse.failure(500, "Server Error", err));
};

module.exports = errorHandlerMW;