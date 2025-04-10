import { wrapRequestFunction } from "../utils/asyncwrapper.utils";

export const signUpCTLR = wrapRequestFunction(async (req, res) => {

    //response
    const responseCode = 201;
    res.status(responseCode).json({ hello: "signUpCtlr" });
});

export const loginUserCTLR = wrapRequestFunction(async (req, res) => {


    //response
    const responseCode = 200;
    res.status(responseCode).json({ hello: "loginCtlr" });

});

export const logoutUserCTLR = wrapRequestFunction(async (req, res) => {


    //response
    const responseCode = 200;
    res.status(responseCode).json({ hello: "logoutctlr" });


});

export const generateRefreshCTLR = wrapRequestFunction(async (req, res) => {


    //response
    const responseCode = 200;
    res.status(responseCode).json({ hello: "generateRefresgctrl" });


});

