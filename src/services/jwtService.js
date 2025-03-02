require('dotenv').config();

const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

const { RefreshTokens } = require('../models').sequelize.models

class JWTService {

    static checkTokenHeader(authHeader) {
        console.log('checkTokenHeader()')
        if (!authHeader || !authHeader.startsWith('Bearer '))
            throw CustomError('token missing', 400);

        return authHeader.split(' ')[1];
    }

    static async genRefresh(userInfo) {
        console.log('genRefresh()');
        let expiryTimeStamp = Date.now() + 3 * 24 * 60 * 60;
        const token = jwt.sign(userInfo, process.env.REFRESHTOKEN, { expiresIn: '3d' });

        await RefreshTokens.create({
            token: token,
            expiry: expiryTimeStamp,
            users_id: userInfo.id,
        });

        return token;
    }

    static async genAccess(userInfo) {
        console.log('this.genAccess()');
        delete userInfo?.id;
        const token = jwt.sign(userInfo, process.env.ACCESSTOKEN, { expiresIn: '2h' });
        return token;
    }

    static async checkValidRefresh(refToken) {
        console.log('this.checkValidRefresh()');
        try {
            let decoded = jwt.verify(refToken, process.env.REFRESHTOKEN);

            const dbToken = await RefreshTokens.findOne({
                where: {
                    token: refToken,
                }
            });

            if (!dbToken)
                throw new CustomError('Invaid Token', 403);

            if (dbToken.expiry < Date.now()) {
                await RefreshTokens.destroy({
                    where: {
                        token: refToken
                    }
                });
                throw new CustomError('Refresh token expired', 403);
            }

            console.log('object :>> ', decoded);
            return decoded;

        } catch (error) {
            throw new CustomError(error.message, 403)
        }

    }

    static async regenRefreshAndAccess(refToken) {
        console.log('this.regenRefreshAndAccess()');
        const decoded = await this.checkValidRefresh(refToken);

        // Remove `exp` from the decoded token before re-signing
        const { iat, exp, ...cleanUserInfo } = decoded;

        await RefreshTokens.destroy({ where: { token: refToken } });

        const newAccessToken = await this.genAccess(cleanUserInfo);
        const newRefreshToken = await this.genRefresh(cleanUserInfo);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };

    }

    static async checkValidAccess(accToken) {
        console.log('this.checkValidAccess()');
        try {
            let decoded = jwt.verify(accToken, process.env.ACCESSTOKEN, { clockTimestamp: false, complete: false });
            console.log('decoded :>> ', decoded);
            return decoded;

        } catch (error) {
            throw new CustomError(error.message || "Invalid Token", 401);
        }



    }
}

module.exports = JWTService;