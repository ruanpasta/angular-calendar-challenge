import Appointment from './Appointment';
import { AppointmentOptions } from './Appointment.interface';

interface ICalendarTile {
  text?: string;
  cols: number;
  rows: number;
  column: number;
  color?: string;
}

interface IEventTile extends ICalendarTile {
  minute: (number | Appointment<AppointmentOptions>);
  hour: number;
  day?: number;
}

export { ICalendarTile, IEventTile };
