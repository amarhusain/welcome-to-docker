import { NextFunction, Request, Response } from "express";
import { CustomError } from "../common/errors/custom-error";
import logger from "../common/logger";
import { userService } from "../services/user.service";
import { USER_ROLE } from "../utils/constants";


class AuthController {

    async signup(req: Request, res: Response, next: NextFunction) {
        const { email, name, mobile, password } = req.body;
        try {
            const result = await userService.createUser({ name, email, mobile, password, role: USER_ROLE.PATIENT, resetNonce: false });
            if (result instanceof CustomError || result instanceof Error) {
                next(result);
            } else {
                res.status(200).send(result);
                logger.info('API url "' + req.originalUrl + '" handled successfully!');
            }
        } catch (error) {
            next(error);
        }
    }

    async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await userService.authenticateUser(req.body);
            if (result instanceof CustomError || result instanceof Error) {
                next(result);
            } else {
                res.status(200).send(result);
                logger.info('API url "' + req.originalUrl + '" handled successfully!');
            }
        } catch (error) {
            next(error);
        }
    }

    async sendPasswordResetMailRequest(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        try {
            const result = await userService.sendPasswordResetMailRequest(email);
            if (result instanceof CustomError || result instanceof Error) {
                next(result);
            } else {
                res.status(200).send(result);
                logger.info('API url "' + req.originalUrl + '" handled successfully!');
            }
        } catch (error) {
            next(error);
        }
    }


    async resetPasswordRequest(req: Request, res: Response, next: NextFunction) {
        const { passowrd, token } = req.body;
        try {
            const result = await userService.resetPassword(passowrd, token);
            if (result instanceof CustomError || result instanceof Error) {
                next(result);
            } else {
                res.status(200).send(result);
                logger.info('API url "' + req.originalUrl + '" handled successfully!');
            }
        } catch (error) {
            next(error);
        }
    }


    async getDoctorList(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await userService.getDoctorList();
            if (result instanceof CustomError || result instanceof Error) {
                next(result);
            } else {
                res.status(200).send(result);
                logger.info('API url "' + req.originalUrl + '" handled successfully!');
            }
        } catch (error) {
            next(error);
        }
    }

}

export const authController = new AuthController();
