
const wrapController = function (controllerFunction) {
    return async (req, res, next) => {
        try {
            return await controllerFunction(req, res);
        } catch (error) {
            console.log('Controller Error:', error);
            next(error);
        }
    };
};

const wrapMiddleware = function (middlewareFunction) {
    return async (req, res, next) => {
        try {
            return await middlewareFunction(req, res, next)

        } catch (error) {
            console.log('Middleware Error', error);
            next(error);
        }
    };
};

module.exports = { wrapController, wrapMiddleware };