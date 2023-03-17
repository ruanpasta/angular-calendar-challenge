interface ICalendarTile {
  text?: string
  cols: number
  rows: number
  color?: string
}

interface IEventTile extends ICalendarTile {
  column: number
  date?: Date
}

type ICalendarOrEventTileArray = (CalendarTile<ICalendarTile> | CalendarTile<IEventTile>)[]

export type { ICalendarOrEventTileArray }
export { ICalendarTile, ITimeTile, IHeaderTile, IEventTile}
