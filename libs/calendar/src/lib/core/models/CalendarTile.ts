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
    day
  }: {
    text?: string,
    cols: number,
    rows: number,
    column?: number,
    color?: string,
    hour?: number,
    day?: number
  }): CalendarTile<T> {
    if (hour !== undefined) {
      const minutes = [0, 15, 30, 45];
      const event = { text, cols, rows, column, hour, color, minutes, day } as T;
      return new CalendarTile<T>(event);
    }
    const calendarTile = { text, cols, rows, color, column } as T;
    return new CalendarTile<T>(calendarTile);
  }

}
