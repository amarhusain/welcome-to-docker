import { NextFunction, Request, Response } from "express";
import { CustomError } from "../common/errors/custom-error";
import logger from "../common/logger";
import { prescriptionService } from "../services/prescription.service";


class PrescriptionController {

    async savePrescription(req: Request, res: Response, next: NextFunction) {
        const { prescription, user } = req.body;
        const loggedInUser = req.body.payload;

        try {

            const result = await prescriptionService.savePrescription({ prescription, userId: user, doctorId: loggedInUser.userId });
            if (result instanceof CustomError || result instanceof Error) {
                next(result);
            } else {
                res.status(200).send(result);
                logger.info('API url "' + req.originalUrl + '" handled successfully!');
            }

        } catch (error: any) {
            next(error);
        }
    }

    async fetchUserPrescription(req: Request, res: Response, next: NextFunction) {
        const userId = req.query.userId;

        const result = await prescriptionService.fetchPrescriptionByUserId(userId);

        if (result instanceof CustomError || result instanceof Error) {
            next(result);
        } else {
            res.status(200).send(result);
            logger.info('API url "' + req.originalUrl + '" handled successfully!');
        }

    }


}

export const prescriptionController = new PrescriptionController();
