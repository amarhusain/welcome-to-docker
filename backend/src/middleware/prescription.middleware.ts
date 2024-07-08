import { NextFunction, Request, Response } from "express";
import logger from "../common/logger";


class PrescriptionMiddleware {

    async validateSavePrescriptionRequestBody(req: Request, res: Response, next: NextFunction) {
        if (req.body.prescription && req.body.user) {
            next();
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

    async validateRequestQueryString(req: Request, res: Response, next: NextFunction) {
        if (req.query.userId) {
            next();
        } else {
            logger.error('While calling API "' + req.originalUrl + '" missing required field');
            res.status(400).send({ error: 'missing required field' })
        }
    }

}

export default new PrescriptionMiddleware;