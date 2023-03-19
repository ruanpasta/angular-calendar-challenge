import { AppointmentTypes, IAppointment } from './Appointment.interface';

export default class Appointment implements IAppointment {
  date: Date;
  title: string;
  type: AppointmentTypes;
  guests: string[];
  location: string;
  descripiton: string
  constructor({ date, title, type, guests, location, descripiton }: IAppointment) {
    this.date = date
    this.title = title || ''
    this.type = type || AppointmentTypes.APPOINTMENTSCHEDULE
    this.guests = guests || []
    this.location = location || ''
    this.descripiton = descripiton || ''
  }
}
