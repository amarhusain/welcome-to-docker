import { Model, Schema, model } from "mongoose";
import User from "./user.model";


export interface IPatient {
    userId: Schema.Types.ObjectId;
    gender: string;
    age: number;
    occupation: string;
    address: string;
    presentComplain: string;
    pastMedicalHistory: string;
    familySevereDisease: string;
    familySevereDiseaseSide: string;
    familySevereDiseaseMember: string;
    familySevereDiseaseDetail: string;
    smoking: string;
    alcoholic: string;
    drugAddict: string;

}

export interface IPatientDocument extends IPatient, Document { }

export interface IPatientModel extends Model<IPatientDocument> {
    buildPatient(args: IPatient): IPatientDocument;
}

const PatientSchema: Schema<IPatientDocument> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    occupation: { type: String, required: true },
    address: { type: String, required: true },
    presentComplain: { type: String, required: true },
    pastMedicalHistory: { type: String, required: true },
    familySevereDisease: { type: String, required: true },
    familySevereDiseaseSide: { type: String, required: false },
    familySevereDiseaseMember: { type: String, required: false },
    familySevereDiseaseDetail: { type: String, required: false },
    smoking: { type: String, required: true },
    alcoholic: { type: String, required: true },
    drugAddict: { type: String, required: true },
});

PatientSchema.statics.buildPatient = (args: IPatient) => {
    return new Patient(args)
}

const Patient = model<IPatientDocument, IPatientModel>('Patient', PatientSchema);


export default Patient;