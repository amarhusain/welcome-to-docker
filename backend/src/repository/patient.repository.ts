import { PatientDetailDto } from "../dto/user.dto";
import Patient, { IPatientModel } from "../models/patient.model";


export class PatientRepository {

    constructor(private patientModel: IPatientModel) { }

    async addPatientDetail(patientDetailDto: PatientDetailDto) {
        const patient = new this.patientModel(patientDetailDto);
        return patient.save();
    }

    async findPatientByUserId(userId: string) {
        return this.patientModel.findOne({ userId });
    }
    async getAllPatient() {
        return this.patientModel.find({});
    }
}


export const patientRepository = new PatientRepository(Patient);