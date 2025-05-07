import { v4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Token } from "../models/Token";
import CustomError from "../utils/CustomError.utils";

import { config } from 'dotenv';
config();

const ACCESS_TOKEN_EXPIRY = "6h",
    REFRESH_TOKEN_EXPIRY = "1d";

export default class JWTService {
    static checkTokenHeader(authHeader: string): string {
        if (!authHeader || !authHeader.startsWith("Bearer "))
            throw new CustomError(401, "Token missing");

        return authHeader.split(" ").filter(Boolean)[1]
    }

    static async checkValidAccess(accTokenString: string): Promise<JwtPayload> {
        const accessToken = this.checkTokenHeader(accTokenString);

        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;

        const tokenPair = await Token.findOne({
            where: {
                jti: payload.jti!,
                user_id: payload.uid!,
                access_token: accessToken
            },
            raw: true
        });

        if (!tokenPair)
            throw new CustomError(401, "invalid access token");

        return payload
    }

    static async generateNewTokenPair(uId: number, uname: string): Promise<Token> {

        //create a new session id for the token
        const sessionId = v4();

        // prepare the payload for the tokens
        const payload: JwtPayload = {
            jti: sessionId, // this is sessions id. this string is stored in database to uniquely represent session
            sub: uname, // this has username
            uid: uId, // this has user id
            iss: "blog_post",
        };

        // generate new access token
        const newAccessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        // generate new refresh token
        const newRefreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: REFRESH_TOKEN_EXPIRY! }
        );

        // gets the expiry from token and adds it to token expiry 
        let decoded = jwt.decode(newRefreshToken) as JwtPayload;

        return Token.create({
            jti: sessionId,
            refresh_token: newRefreshToken,
            access_token: newAccessToken,
            refresh_tokens_expiry: decoded.exp! * 1000,
            user_id: uId
        });
    }

    static async regenerateNewTokenPair(refreshToken: string): Promise<Token> {
        try {

            // if no refreshToken then its error
            if (!refreshToken)
                throw new CustomError(401, "refresh token missing");

            // get the payload from refresh token by verifying it
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

            // then check it against the database
            const tokenPair = await Token.findOne({
                where: {
                    jti: payload.jti,
                    user_id: payload.uid,
                    refresh_token: refreshToken,
                },
                raw: true
            });

            // const tokenPair = await Token.scope({
            //     method: ['byJti', payload.jti!]
            // }).scope({
            //     method: ['byUser', payload.uid!]
            // }).findOne({
            //     where: { refresh_token: refreshToken }
            // });

            // if no token in database then it is in error
            if (!tokenPair)
                throw new CustomError(401, "invalid refresh token");

            return this.generateNewTokenPair(payload.uid, payload.sub!);
        }
        catch (error) {

            // a flaw remains here what is client / attacker is sending continuous expired token
            // then the delete query runs every time isn't it?

            // if the token is expired delete it from the database.
            if (error instanceof jwt.TokenExpiredError) {
                const decoded = jwt.decode(refreshToken) as JwtPayload;
                await Token.destroy({ where: { jti: decoded.jti! } });

                throw new CustomError(401, "refresh token expired");
            }
            throw error;
        }
    }

    static async deleteTokenPairByUserId(userId: number, tokenId?: string) {

        // why create the whole interface just for where clause at it changes acc to model
        // may add INTERFACE for where clause combining whole model but only nec. attributes
        const whereClause: {
            user_id: number,
            jti?: string
        } = { user_id: userId };

        if (tokenId)
            whereClause.jti = tokenId;

        const refToken = await Token.destroy({
            where: whereClause
        });

        if (!refToken)
            throw new CustomError(400, "refresh token could not be destroyed");
    }
}