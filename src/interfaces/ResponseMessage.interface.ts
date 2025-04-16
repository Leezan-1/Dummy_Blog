export interface ResponseMessage {
    code: number,
    status: string,
    success: boolean,
    message: string,
    error?: object,
    data?: object,
}

export default interface ApiResponseFn {
    (statusCode: number, message: string | null, dataOrError?: object | undefined): ResponseMessage
}