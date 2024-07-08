import { CreatePrescriptionDto } from "../dto/prescription.dto";
import Prescription, { IPrescriptionModel } from "../models/prescription.model";


export class PrescriptionRepository {

    constructor(private prescriptionModel: IPrescriptionModel) { }

    async createPrescription(createPrescriptionDto: CreatePrescriptionDto) {
        const prescription = new this.prescriptionModel(createPrescriptionDto);
        return await prescription.save();
    }

    async fetchPrescriptionByUserId(userId: string) {
        return await this.prescriptionModel.find({ userId }).select('-_id -__v -updatedAt').populate({ path: 'doctorId', select: 'name -_id' });
    }

}

export const prescriptionRepository = new PrescriptionRepository(Prescription);