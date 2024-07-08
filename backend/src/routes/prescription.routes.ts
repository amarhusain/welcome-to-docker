import { Router } from "express";
import { prescriptionController } from "../controllers/prescription.controller";
import authMiddleware from "../middleware/auth.middleware";
import prescriptionMiddleware from "../middleware/prescription.middleware";

const prescriptionRouter = Router();

prescriptionRouter.post('/',
    authMiddleware.validateUserAuthentication,
    prescriptionMiddleware.validateSavePrescriptionRequestBody,
    prescriptionController.savePrescription);

prescriptionRouter.get('/',
    authMiddleware.validateUserAuthentication,
    prescriptionMiddleware.validateRequestQueryString,
    prescriptionController.fetchUserPrescription);


export default prescriptionRouter;

// CRUD - create, Read, Update, Delete 