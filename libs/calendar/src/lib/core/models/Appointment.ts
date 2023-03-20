import {
  EventAppointment,
  TaskAppointment,
  AppointmentTypes,
  AppointmentOptions,
} from './Appointment.interface';
import { v4 as uuidV4 } from 'uuid';


export default class Appointment<T extends AppointmentOptions> {
  constructor(public event: T) {}

  static createAppointment<
    T extends AppointmentOptions
  >(appointment: T): Appointment<T> {
    const id = uuidV4();
    const { type } = appointment;

    switch (type) {
      case AppointmentTypes.TASK: {
        const { tasks } = appointment as TaskAppointment;
        const appointmentTask = { id, tasks, ...appointment };
        return new Appointment<T>(appointmentTask as T);
      }
      case AppointmentTypes.REMINDER: {
        const appointmentReminder = { id, ...appointment };
        return new Appointment<T>(appointmentReminder as T);
      }
      default: {
        const { guests, location, description } =
          appointment as EventAppointment;
        const appointmentEvent = {
          id,
          guests,
          location,
          description,
          ...appointment,
        };
        return new Appointment<T>(appointmentEvent as T);
      }
    }
  }
}
