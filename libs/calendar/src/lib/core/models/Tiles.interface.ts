interface ICalendarTile {
  text?: string
  cols: number
  rows: number
  color?: string
}

interface IEventTile extends ICalendarTile {
  column: number
  minutes: number[]
  hour: number,
  date?: Date
}

export { ICalendarTile, IEventTile }
