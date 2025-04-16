import ApiResponseFn from "../interfaces/ResponseMessage.interface";
import { getReasonPhrase } from "http-status-codes";

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
        success: true,
        message: msg!,
        error: error!
    }
};