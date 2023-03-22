import Appointment from './Appointment';
import { AppointmentOptions } from './Appointment.interface';

interface ICalendarTile {
  text?: string;
  cols: number;
  rows: number;
  column: number;
  color?: string;
  month?: number;
  year?: number;
}

interface IEventTile extends ICalendarTile {
  minute: number;
  appointment: Appointment<AppointmentOptions> | null;
  hour: number;
  day?: number;
  date?: Date;
}

export { ICalendarTile, IEventTile };
