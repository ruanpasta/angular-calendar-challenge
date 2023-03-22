import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Appointment from '../models/Appointment';
import {
  AppointmentDateRange,
  AppointmentOptions,
} from '../models/Appointment.interface';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private appointments: BehaviorSubject<
    (Appointment<AppointmentOptions>)[]
  > = new BehaviorSubject<(Appointment<AppointmentOptions>)[]>([]);

  get appointments$(): Observable<(Appointment<AppointmentOptions>)[]> {
    return this.appointments.asObservable();
  }

  create(appointment: Appointment<AppointmentOptions>) {
    const appointments = this.appointments.getValue();
    appointments.push(appointment);
    this.appointments.next(appointments);
  }

  delete(appointment: Appointment<AppointmentOptions>) {
    const appointments = this.appointments.getValue();
    const index = appointments.findIndex(appointmentValue => appointmentValue.event.id === appointment.event.id);
    if (index > -1) appointments.splice(index, 1)
    this.appointments.next(appointments);
  }

  updateDateTime(id: string, dateTime: Date | AppointmentDateRange) {
    const appointments = this.appointments.getValue();
    const index = appointments.findIndex(appointmentValue => appointmentValue.event.id === id);
    if (index > -1) appointments[index].event.dateTime = dateTime
    this.appointments.next(appointments);
  }
}
