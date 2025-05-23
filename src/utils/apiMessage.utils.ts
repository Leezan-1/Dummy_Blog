// built-in & third party modules
import { getReasonPhrase } from "http-status-codes";

// schemas, interfaces & enums
import ApiResponseFn from "../interfaces/ResponseMessage.interface";


export const apiSuccessMsg: ApiResponseFn = (statusCode, msg = null, data?) => {
    return {
        code: statusCode,
        status: getReasonPhrase(statusCode),
        success: true,
        message: msg!,
        data: data!
    }
};

export const apiFailureMsg: ApiResponseFn = (statusCode, msg = null, error?) => {
    return {
        code: statusCode,
        status: getReasonPhrase(statusCode),
        success: false,
        message: msg!,
        error: error!
    }
};