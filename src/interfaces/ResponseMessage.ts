interface ResponseMessage {
    code: number,
    success: boolean,
    message: string,
    error?: object,
    data?: object,
}

export default ResponseMessage;