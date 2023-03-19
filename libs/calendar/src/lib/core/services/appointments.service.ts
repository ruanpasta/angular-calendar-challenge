import { Injectable } from '@angular/core';
import { IAppointment } from '../models/Appointment.interface'


@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private appointments: IAppointment[] = []

  // constructor() { }

  create(appointment: IAppointment) {
    this.appointments.push(appointment)
  }
}
