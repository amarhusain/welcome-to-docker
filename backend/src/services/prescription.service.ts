import { CreatePrescriptionDto } from "../dto/prescription.dto";
import { PrescriptionRepository, prescriptionRepository } from "../repository/prescription.repository";

export class PrescriptionService {
    constructor(private prescriptionRepository: PrescriptionRepository) {

    }



    async savePrescription(createPrescriptionDto: CreatePrescriptionDto) {
        return await this.prescriptionRepository.createPrescription(createPrescriptionDto);
    }

    async fetchPrescriptionByUserId(userId: any) {
        return await this.prescriptionRepository.fetchPrescriptionByUserId(userId);
    }




}

export const prescriptionService = new PrescriptionService(prescriptionRepository);