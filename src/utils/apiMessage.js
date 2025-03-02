const { StatusCodes, getMessage } = require('http-status-code');

class ApiResponse {

    static success(statusCode, msg, data = null) {
        return {
            code: statusCode,
            success: true,
            message: msg || getMessage(statusCode),
            data: data,
        }
    }

    static failure(statusCode, msg, error = null) {
        return {
            code: statusCode,
            success: false,
            message: msg || getMessage(statusCode),
            error: error
        }
    }
}

module.exports = ApiResponse;