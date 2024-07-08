import { CreateAppointmentDto } from "../dto/user.dto";
import Appointment, { IAppointmentModel } from "../models/appointment.model";


export class AppointmentRepository {

    constructor(private appointmentModel: IAppointmentModel) { }

    async createAppointment(createAppointmentDto: CreateAppointmentDto) {
        const appointment = new this.appointmentModel(createAppointmentDto);
        // console.log('appointment saved', appointment);
        return await appointment.save();
    }

    async getAllAppointment() {
        let date = new Date();
        date.setHours(0, 0, 0);
        return this.appointmentModel.find({ date: { $gte: date } });
    }

    async getAppointmentByDoctorId(doctorId: string) {
        let date = new Date();
        date.setHours(0, 0, 0);
        return this.appointmentModel.find({ doctorId, date: { $gte: date } })
            .populate({ path: 'doctorId', select: 'name' })
            .populate({ path: 'userId', select: 'name email mobile role' });
    }

    async getAppointmentByDoctorIdAndDate(doctorId: string, searchDate: string) {
        const startDate = new Date(searchDate);
        startDate.setHours(0, 0, 0);
        const endDate = new Date(searchDate);
        endDate.setHours(23, 59, 59, 999);
        return this.appointmentModel.find({ doctorId, date: { $gte: startDate, $lte: endDate } })
            .populate({ path: 'doctorId', select: 'name' })
            .populate({ path: 'userId', select: 'name email mobile role' });
    }
}


export const appointmentRepository = new AppointmentRepository(Appointment);