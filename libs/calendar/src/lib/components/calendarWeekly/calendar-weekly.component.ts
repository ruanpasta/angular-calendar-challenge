import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatGridListModule } from '@angular/material/grid-list'
import {
  ICalendarTile,
  ICalendarOrEventTileArray,
  IEventTile,
} from '../../models/Tiles'
import CalendarTile from '../../models/CalendarTile'

@Component({
  selector: 'calendar-challenge-calendar-weekly',
  standalone: true,
  imports: [CommonModule, MatGridListModule],
  templateUrl: './calendar-weekly.component.html',
  styleUrls: ['./calendar-weekly.component.scss'],
})
export class CalendarViewComponent implements OnInit {
  selected: Date = new Date()
  weekDaysTiles: CalendarTile<ICalendarTile>[] = []
  hourlyTiles: ICalendarOrEventTileArray = []

  constructor() {
    const today = new Date()
    this.weekDaysTiles = this.setWeekDaysTiles(today)
    this.hourlyTiles = this.setHourlyTiles()
  }

  ngOnInit(): void {}

  getNextMonthlyDays(day: number | undefined, month: number) {
    const date = new Date()
    date.setFullYear(new Date().getFullYear(), month - 1, day)

    let days = []

    for (let i = 1; i <= 4; i++) {
      if (i !== 1) date.setDate(date.getDate() + 1)

      days.push(date.getDate())
    }

    return days
  }

  setWeekDaysTiles(date: Date = new Date()) {
    const currentDay = date.getDate()
    const currentMonth = date.getMonth()
    const days = this.getNextMonthlyDays(currentDay, currentMonth)

    const tiles: CalendarTile<ICalendarTile>[] = days.map((day) =>
      CalendarTile.createCalendarTile<ICalendarTile>({
        text: day.toString(),
        cols: 3,
        rows: 3,
        color: 'lightblue',
      })
    )

    tiles.unshift(
      CalendarTile.createCalendarTile<ICalendarTile>({
        cols: 1,
        rows: 3,
        color: 'lightblue',
      })
    )

    return tiles
  }

  setHourlyTiles(): ICalendarOrEventTileArray {
    const hours = Array.from({ length: 24 }, (_, index) => index + 1)
    let tiles: ICalendarOrEventTileArray = []

    hours.map((hour, index) => {
      tiles.push(
        CalendarTile.createCalendarTile<ICalendarTile>({
          text: `${hour <= 12 ? hour + ' AM' : hour - 12 + ' PM'}`,
          cols: 1,
          rows: 1,
          color: 'lightpink',
        })
      )

      for (let i = 0; i < 4; i++) {
        tiles.push(
          CalendarTile.createEventTile<IEventTile>({
            cols: 3,
            rows: 1,
            column: i + 1,
            color: 'lightgray',
          })
        )
      }
    })

    return tiles
  }

  onCalendarTileClick(eventTile: CalendarTile<ICalendarTile>, type: string) {
    console.log('Tile clicked:', eventTile, type)
  }

  onCalendarOrEventTileClick(
    eventTile: ICalendarOrEventTileArray,
    type: string
  ) {
    console.log('Tile clicked:', eventTile, type)
  }
}
