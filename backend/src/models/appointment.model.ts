import { Model, Schema, model } from "mongoose";
import User from "./user.model";

export interface IAppointment {
    date: Date;
    doctorId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
}

export interface IAppointmentDocument extends IAppointment, Document { }

export interface IAppointmentModel extends Model<IAppointmentDocument> {
    buildAppointment(args: IAppointment): IAppointmentDocument;
}

const AppointmentSchema: Schema<IAppointmentDocument> = new Schema({
    date: { type: Date, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: User, required: true },
    userId: { type: Schema.Types.ObjectId, ref: User, required: true }
});

AppointmentSchema.statics.buildAppointment = (args: IAppointment) => {
    return new Appointment(args)
}

const Appointment = model<IAppointmentDocument, IAppointmentModel>('Appointment', AppointmentSchema);


export default Appointment;