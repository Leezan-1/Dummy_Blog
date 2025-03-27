require("dotenv").config();

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../utils/CustomError");
const { Op } = require("sequelize");
const { Tokens } = require("../models").sequelize.models

const ACCESS_TOKEN_EXPIRY = "6h";
const REFRESH_TOKEN_EXPIRY = "3d";

class JWTService {
    // checks and extracts token headers.
    static checkTokenHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith("Bearer "))
            throw new CustomError("Token missing", 400);

        // extract token
        return authHeader.split(" ").filter(Boolean)[1];
    }

    static async generateNewTokenPair(userInfo) {
        if (userInfo.sub)
            // if sub is present then it came through prev token so userid may not be present
            userInfo.id = userInfo.sub;

        const jti = uuidv4();

        const payload = {
            session_id: jti,
            sub: userInfo.id,
            username: userInfo?.username,
            iss: "Blog Post",
        };

        const newRefreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        const newAccessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        let decoded = jwt.decode(newRefreshToken);

        await Tokens.create({
            jti: jti,
            refresh_token: newRefreshToken,
            access_token: newAccessToken,
            refresh_tokens_expiry: decoded.exp * 1000,
            users_id: userInfo.id,
        });

        return { refreshToken: newRefreshToken, accessToken: newAccessToken };
    }

    static async checkValidAccess(accToken) {
        try {
            // checks token sent with Bearer.
            let accessToken = this.checkTokenHeader(accToken);

            // verifies the jwt token
            let { iat, exp, ...payload } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            // remove unnecessary data.z

            // check if token exists in database. Else error!
            const tokensPair = await Tokens.findByPk(payload?.session_id,
                {
                    where: {
                        [Op.and]: [{
                            users_id: payload?.sub,
                            access_token: accessToken,
                        }]
                    },
                    raw: true
                }
            );
            if (tokensPair)
                return payload;

            throw new CustomError("Invalid Access Token!", 401);

        } catch (error) {
            throw new CustomError(error.message || "Invalid Access Token", 401);
        }
    }

    static async regenerateTokenPair(refToken) {
        try {
            // checks if valid refresh token!
            // const refreshToken = this.checkTokenHeader(refToken);
            if (!refToken)
                throw new CustomError('Invalid Refresh Token', 401);

            // verify the refresh token!
            const { iat, exp, session_id, ...payload } = jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET);

            // check if refresh token exists in database.
            const tokensPair = await Tokens.findByPk(session_id,
                {
                    where: {
                        [Op.and]: [{ users_id: payload?.sub, refresh_token: refToken }]
                    },
                    raw: true,
                });

            if (!tokensPair)
                throw new CustomError('Invalid Refresh Token!');

            // if exists then delete the tokens pair
            tokensPair.destroy();

            const newTokensPair = await this.generateNewTokenPair(payload)

            return { accessToken: newTokensPair.accessToken, refreshToken: newTokensPair.refreshToken };

        } catch (error) {
            if (error === "TokenExpiredError") {
                let decoded = jwt.decode(refToken);
                await Tokens.destroy({ where: { jti: decoded?.session_id } });

                throw new CustomError('Refresh Token Expired!');
            }
            throw new CustomError(error.message, 401);
        }
    }

    static async deleteRefreshByUserID(user_id, tokenId) {

        const refTokens = await Tokens.destroy({
            where: {
                [Op.and]: [{ jti: tokenId, users_id: user_id }],
            }
        });

        // if refTokens != 1 then it is an error
        if (!refTokens)
            throw new CustomError("refresh token couldnot be destroyed");
    }
}

module.exports = JWTService;