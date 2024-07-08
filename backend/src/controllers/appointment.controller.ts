import { NextFunction, Request, Response } from "express";
import { CustomError } from "../common/errors/custom-error";
import logger from "../common/logger";
import { appointmentService } from "../services/appointment.service";


class AppointmentController {

    async bookAppointment(req: Request, res: Response, next: NextFunction) {
        const { name, email, mobile, gender, age, occupation, address, appointmentDate,
            presentComplain, pastMedicalHistory, familySevereDisease, familySevereDiseaseSide,
            familySevereDiseaseMember, familySevereDiseaseDetail, smoking, alcoholic,
            drugAddict, doctorId } = req.body;

        try {
            // const token = req.header('Authorization')?.replace('Bearer ', '');
            // // Convert to IST
            // const istOptions = { timeZone: 'Asia/Kolkata' };
            // const utcDate = new Date(appointmentDate);
            const appointmentDt = new Date(appointmentDate);
            const data = {
                name, email, mobile, gender, age, occupation, address, appointmentDt, presentComplain, pastMedicalHistory, familySevereDisease, familySevereDiseaseSide,
                familySevereDiseaseMember, familySevereDiseaseDetail, smoking, alcoholic,
                drugAddict, doctorId
            };
            const result = await appointmentService.createUserAndBookAppointment(data);
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

    // async addPatientDetail(req: Request, res: Response, next: NextFunction) {
    //     const { userId, gender, age, occupation,
    //         address, presentComplain, pastMedicalHistory, familySevereDisease,
    //         familySevereDiseaseSide, familySevereDiseaseMember,
    //         familySevereDiseaseDetail, smoking, alcoholic,
    //         drugAddict, payload } = req.body;
    //     try {
    //         const result = await appointmentService.addPatientDetail({
    //             userId, gender, age, occupation,
    //             address, presentComplain, pastMedicalHistory, familySevereDisease,
    //             familySevereDiseaseSide, familySevereDiseaseMember,
    //             familySevereDiseaseDetail, smoking, alcoholic,
    //             drugAddict
    //         }, payload);
    //         if (result instanceof CustomError || result instanceof Error) {
    //             next(result);
    //         } else {

    //             res.status(200).send(result);
    //             logger.info('API url "' + req.originalUrl + '" handled successfully!');
    //         }
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async getAppointmentSlot(req: Request, res: Response, next: NextFunction) {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        try {

            const result = await appointmentService.getAppointmentSlot(token);
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

    async getAppointmentList(req: Request, res: Response, next: NextFunction) {
        const { payload } = req.body;
        try {
            const result = await appointmentService.getAppointmentByDoctorId(payload.userId);
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

    async getAppointmentListByDoctorIdAndDate(req: Request, res: Response, next: NextFunction) {
        const date = req.params.date;
        const { payload } = req.body;
        try {
            const result = await appointmentService.getAppointmentByDoctorIdAndDate(payload.userId, date);
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

export const appointmentController = new AppointmentController();
