import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { config } from "../common/config";
import logger from "../common/logger";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { USER_ROLE } from "../utils/constants";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

class AuthMiddleware {

    async validateSigninRequestBodyFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.emailOrUsername && req.body.password) {
            next();
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

    async validateSignupRequestBodyFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.email && req.body.name && req.body.mobile && req.body.password) {
            next();
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

    async validateUserAuthentication(req: Request, res: Response, next: NextFunction) {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            logger.error('Auth token not found');
            res.status(401).send({ error: 'Auth token not found' });
        } else {
            if (config.jwtKey) {
                try {
                    const decoded = await authService.verifyJwt(token, config.jwtKey);
                    req.body.payload = decoded;
                    next();

                } catch (error: any) {
                    if (error.name === 'TokenExpiredError') {
                        logger.error(`[${error.name}] : ${error.message}`);
                        res.status(401).send({ error: `[${error.name}] : ${error.message}` });
                    } else if (error.name === 'JsonWebTokenError') {
                        logger.error(`[${error.name}] : ${error.message}`);
                        res.status(401).send({ error: `[${error.name}] : ${error.message}` });
                    } else {
                        logger.error(`[${error.name}] : ${error.message}`);
                        res.status(401).send({ error: `[${error.name}] : ${error.message}` });
                    }

                }
            } else {
                logger.error('JWT key not found');
                res.status(401).send({ error: 'JWT key not found' });
            }

        }

    }

    async checkUserRoleIsDoctor(req: Request, res: Response, next: NextFunction) {
        const { payload } = req.body;
        if (payload) {
            const result = await userService.findUserById(payload.userId);
            if (result) {
                if (result.role === USER_ROLE.DOCTOR) {
                    next();
                } else {
                    logger.error('Unauthorised access');
                    res.status(401).send({ error: 'Unauthorised access' })
                }
            } else {
                logger.error('Unauthorised access');
                res.status(401).send({ error: 'Unauthorised access' });
            }
        } else {
            logger.error('Unauthorised access');
            res.status(401).send({ error: 'Unauthorised access' });
        }
    }

    async validateSendPasswordResetMailRequestBodyFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.email) {
            next();
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

    async validateResetPasswordRequestBodyFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.passowrd && req.body.cnfrmPassword && req.body.token) {
            if (req.body.passowrd === req.body.cnfrmPassword) {
                next();
            } else {
                logger.error('While calling API "' + req.originalUrl + '" missing required field');
                res.status(400).send({ error: 'Passwords must match' })
            }
        } else if (!req.body.token) {
            logger.error('While calling API "' + req.originalUrl + '" missing token');
            res.status(400).send({ error: 'Password reset link has expired!' })
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }


}

export default new AuthMiddleware;