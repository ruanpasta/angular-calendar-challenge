import { ICalendarTile, IEventTile } from './Tiles'

export default class CalendarTile<T extends ICalendarTile> {
  constructor(public event: T) {}

  static createEventTile<T extends IEventTile>({
    text = '',
    cols,
    rows,
    column,
    date = new Date(),
    color = 'lightgray',
  }: {
    text?: string,
    cols: number,
    rows: number,
    column: number,
    date?: Date,
    color?: string
  }): CalendarTile<T> {
    const event = { text, cols, rows, column, date, color }
    return new CalendarTile<T>(event as T)
  }
 
  static createCalendarTile<T extends ICalendarTile>({
    text,
    cols,
    rows,
    color,
  }: {
    text?: string,
    cols: number,
    rows: number,
    color?: string
  }): CalendarTile<T> {
    const event = { text, cols, rows, color }
    return new CalendarTile<T>(event as T)
  }
}
