import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatGridListModule } from '@angular/material/grid-list'
import {
  ICalendarTile,
  IEventTile,
} from '../../core/models/Tiles.interface'
import CalendarTile from '../../core/models/CalendarTile'

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
  hourlyTiles: CalendarTile<IEventTile>[] = []
  @Input() numberDaysCalendar = 7
  calendarColumns = 22 

  ngOnInit(): void {
    this.calendarColumns = this.numberDaysCalendar * 3 + 1;
    const today = new Date()
    this.weekDaysTiles = this.setWeekDaysTiles(today)
    this.hourlyTiles = this.setHourlyTiles()
  }

  getNextMonthlyDays(day: number | undefined, month: number) {
    const date = new Date()
    date.setFullYear(new Date().getFullYear(), month - 1, day)

    const days = []

    for (let i = 1; i <= this.numberDaysCalendar; i++) {
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
        rows: 2,
        color: 'lightblue',
      })
    )

    tiles.unshift(
      CalendarTile.createCalendarTile<ICalendarTile>({
        cols: 1,
        rows: 2,
        color: 'lightblue',
      })
    )

    return tiles
  }

  setHourlyTiles(): CalendarTile<IEventTile>[] {
    const hours = Array.from({ length: 24 }, (_, index) => index + 1)
    const tiles: CalendarTile<IEventTile>[] = []

    hours.map((hour) => {
      tiles.push(
        CalendarTile.createCalendarTile<IEventTile>({
          text: `${hour <= 12 ? hour + ' AM' : hour - 12 + ' PM'}`,
          cols: 1,
          rows: 1,
          color: 'lightpink',
        })
      )

      for (let i = 0; i < this.numberDaysCalendar; i++) {
        tiles.push(
          CalendarTile.createEventTile<IEventTile>({
            cols: 3,
            rows: 1,
            column: i + 1,
            color: 'lightgray',
            hour
          })
        )
      }
    })

    return tiles
  }

  onCalendarOrEventTileClick(
    eventTile: (CalendarTile<ICalendarTile> | CalendarTile<IEventTile>),
    minute?: number,
  ) {
    console.log('Tile clicked:', eventTile, minute)
  }
}
