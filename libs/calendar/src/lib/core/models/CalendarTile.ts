import { ICalendarTile, IEventTile } from './Tiles.interface'

export default class CalendarTile<T extends ICalendarTile> {
  constructor(public event: T) {}

  static createEventTile<T extends IEventTile>({
    text = '',
    cols,
    rows,
    column,
    color = 'lightgray',
    hour
  }: {
    text?: string,
    cols: number,
    rows: number,
    column: number,
    color?: string
    hour: number
  }): CalendarTile<T> {
    const minutes = [0, 15, 30, 45]
    const event = { text, cols, rows, column, hour, color, minutes }
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
