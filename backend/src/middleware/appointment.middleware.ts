import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import logger from "../common/logger";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

class AppointmentMiddleware {

    async validateBookAppointmentRequestBodyFields(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.name && req.body.email && req.body.mobile && req.body.gender && req.body.age
            && req.body.occupation && req.body.address && req.body.appointmentDate && req.body.presentComplain
            && req.body.pastMedicalHistory && req.body.familySevereDisease && req.body.smoking && req.body.alcoholic && req.body.drugAddict && req.body.doctorId) {

            if (req.body.familySevereDisease === 'Yes') {
                if (req.body.familySevereDiseaseSide && req.body.familySevereDiseaseMember && req.body.familySevereDiseaseDetail) {
                    next();
                } else {
                    logger.error('While calling API "' + req.originalUrl + '" missing required field');
                    res.status(400).send({ error: 'missing required field' })
                }
            } else {
                next();
            }
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

    // async validateAppointmentListByDateRequestBodyFields(req: Request, res: Response, next: NextFunction) {
    //     if (req.body && req.body.date) {
    //         next();
    //     } else {
    //         logger.error('While calling API "' + req.originalUrl + '" missing required field');
    //         res.status(400).send({ error: 'missing required field' })
    //     }
    // }


}

export default new AppointmentMiddleware;