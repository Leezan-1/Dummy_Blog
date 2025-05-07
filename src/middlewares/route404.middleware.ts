// utility functions & classes
import { apiFailureMsg } from "../utils/apiMessage.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";

const route404MW = wrapRequestFunction(
    async (req, res, next) => {
        const responseCode = 404;
        const responseMsg = apiFailureMsg(responseCode, "route not found");
        res.status(responseCode).json(responseMsg);
    }
);

export default route404MW;