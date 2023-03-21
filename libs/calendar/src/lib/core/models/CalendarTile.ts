import { AppointmentBase, EventAppointment, TaskAppointment } from './Appointment.interface';
import { ICalendarTile, IEventTile } from './Tiles.interface'

export default class CalendarTile<T extends ICalendarTile> {
  constructor(public event: T) {}

  // TODO: improve this code like the Appointments
  static createTile<T extends ICalendarTile | IEventTile>({
    text = '',
    cols,
    rows,
    column,
    color = 'lightgray',
    hour,
    minute,
    day
  }: {
    text?: string,
    cols: number,
    rows: number,
    column?: number,
    color?: string,
    hour?: number,
    minute?: number,
    day?: number
  }): CalendarTile<T> {
    if (hour !== undefined) {
      const event = { text, cols, rows, column, hour, minute, color, day } as T;
      return new CalendarTile<T>(event);
    }
    const calendarTile = { text, cols, rows, color, column } as T;
    return new CalendarTile<T>(calendarTile);
  }

}
