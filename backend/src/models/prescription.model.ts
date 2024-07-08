import { Model, Schema, model } from "mongoose";
import User from "./user.model";

export interface IPrescription {
    prescription: string;
    doctorId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
}

export interface IPrescriptionDocument extends IPrescription, Document { }

export interface IPrescriptionModel extends Model<IPrescriptionDocument> {
    buildPrescription(args: IPrescription): IPrescriptionDocument;
}

const PrescriptionSchema: Schema<IPrescriptionDocument> = new Schema(
    {
        prescription: { type: String, required: true },
        doctorId: { type: Schema.Types.ObjectId, ref: User, required: true },
        userId: { type: Schema.Types.ObjectId, ref: User, required: true }
    },
    {
        timestamps: true
    }
);

PrescriptionSchema.statics.buildPrescription = (args: IPrescription) => {
    return new Prescription(args)
}

const Prescription = model<IPrescriptionDocument, IPrescriptionModel>('Prescription', PrescriptionSchema);

export default Prescription;