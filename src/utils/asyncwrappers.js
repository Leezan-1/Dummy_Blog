
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

module.exports = { wrapController };