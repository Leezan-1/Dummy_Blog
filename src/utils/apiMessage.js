const { getMessage } = require('http-status-code');

class ApiResponse {

    static success(statusCode, msg, data = null) {
        return {
            code: statusCode,
            success: true,
            message: msg || getMessage(statusCode),
            data: data,
        }
    }

    static failure(statusCode, msg = null, error = null) {
        return {
            code: statusCode,
            success: false,
            message: getMessage(statusCode),
            error: {
                reason: msg || error.msg,
                error_object: error
            }
        }
    }
}

module.exports = ApiResponse;