import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { ICalendarTile, IEventTile } from '../../core/models/Tiles.interface';
import CalendarTile from '../../core/models/CalendarTile';
import { AppointmentsService } from '../../core/services/appointments.service';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import {
  AppointmentDateRange,
  AppointmentOptions,
  AppointmentTypes,
} from '../../core/models/Appointment.interface';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import Appointment from '../../core/models/Appointment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'calendar-challenge-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    DragDropModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit, OnChanges, OnDestroy {
  selected: Date = new Date();
  weekDaysTiles: CalendarTile<ICalendarTile>[] = [];
  hourlyTiles: CalendarTile<IEventTile>[] = [];
  eventTiles: CalendarTile<IEventTile>[][] = [];
  appointments: Appointment<AppointmentOptions>[] = [];
  appointmentSubscrption: Subscription = new Subscription();
  calendarColumns = 22;
  @Input() numberDaysCalendar = 7;
  @Input() selectedDay: Date = new Date();

  constructor(
    private appointmentService: AppointmentsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.calendarColumns = this.numberDaysCalendar * 3 + 1;
    this.updateCalendar();

    this.appointmentSubscrption =
      this.appointmentService.appointments$.subscribe((value) => {
        this.appointments = value;
        this.setAppointmentsElements();
      });
  }

  ngOnChanges() {
    if (
      this.hourlyTiles.length &&
      this.weekDaysTiles.length &&
      this.eventTiles.length
    ) {
      this.updateCalendar(true);
    }
  }

  ngOnDestroy(): void {
    this.appointmentSubscrption.unsubscribe();
  }

  public onEventTileClick(eventTile: CalendarTile<IEventTile>) {
    const date = new Date(
      eventTile.event.year || 0,
      eventTile.event.month || 0,
      eventTile.event.day
    );
    this.openAppointmentDialog(
      '300ms',
      '150ms',
      date,
      eventTile.event.hour,
      eventTile.event.minute
    );
  }

  public onDrop(
    event: CdkDragDrop<CalendarTile<IEventTile>, CalendarTile<IEventTile>, any>
  ) {
    const previous = event.previousContainer.data;
    const next = event.container.data;

    if (!previous || !next || previous === next) return;
    const previousTile = this.getTileByTile(previous);
    const nextTile = this.getTileByTile(next);

    if (
      nextTile &&
      !nextTile.event.appointment &&
      previousTile?.event.appointment
    ) {
      const dateTime = this.getNewDateTime(next, previous);
      this.appointmentService.updateDateTime(
        previous.event.appointment?.event.id || '',
        dateTime
      );
      nextTile.event.appointment = previousTile.event.appointment;
      previousTile.event.appointment = null;
    }
  }

  public getTileHeight(appointment: Appointment<AppointmentOptions>): number | string {
    const dateTime = appointment.event.dateTime as AppointmentDateRange;
    if (appointment.event.type !== AppointmentTypes.EVENT) return 'auto';
    const { diffInHours } = this.getHoursAndMinutesDifference(
      dateTime.startDateTime,
      dateTime.endDateTime
    );
    if (diffInHours < 2) return 'auto';
    return 20 * diffInHours;
  }

  public onDeleteAppointment(appointmentId: string, day: number) {
    const tiles =
      this.eventTiles.find((tiles) => tiles[0].event.day === day) || [];
    const eventTile = tiles.find(
      (tile) =>
        tile.event.appointment &&
        tile.event.appointment.event.id === appointmentId
    );
    if (eventTile?.event.appointment) {
      this.appointmentService.delete(eventTile.event.appointment);
      eventTile.event.appointment = null;
    }
  }

  public getNextMonthlyDays(day: number | undefined, month: number): number[] {
    const date = new Date();
    date.setFullYear(new Date().getFullYear(), month - 1, day);

    const days = [];

    for (let i = 1; i <= this.numberDaysCalendar; i++) {
      if (i !== 1) date.setDate(date.getDate() + 1);

      days.push(date.getDate());
    }

    return days;
  }

  private updateCalendar(isChange?: boolean) {
    this.clearTiles();
    this.getTiles();
    if (isChange) this.setAppointmentsElements();
  }

  private getTiles() {
    this.weekDaysTiles = this.setWeekDaysTiles(this.selectedDay);
    this.hourlyTiles = this.setHourlyTiles();

    // Set eventTiles
    this.weekDaysTiles.forEach((tile) =>
      this.eventTiles.push(
        this.getEventTiles(
          Number(tile.event.text),
          tile.event.month || 0,
          tile.event.year || 0
        )
      )
    );
  }

  private clearTiles() {
    this.weekDaysTiles = [];
    this.hourlyTiles = [];
    this.eventTiles = [];
  }

  private setAppointmentsElements() {
    this.appointments.map((appointment) => {
      if (appointment.event.type === AppointmentTypes.EVENT) {
        const startDateTime = (
          appointment.event.dateTime as AppointmentDateRange
        ).startDateTime;

        const day = startDateTime.getDate();
        const hour = startDateTime.getHours();
        const minute = startDateTime.getMinutes();

        const eventDayTiles = this.getEventTilesByDay(day) || [];

        const eventTile = this.getEventTileByHourMinuteTiles(
          hour,
          minute,
          eventDayTiles
        );

        if (eventTile) eventTile.event.appointment = appointment;
      }
    });
  }

  private getEventTilesByDay(day: number): CalendarTile<IEventTile>[] {
    const eventDayTiles = this.eventTiles.find(
      (tiles) => tiles[0].event.day === day
    );
    return eventDayTiles || [];
  }

  private getEventTileByHourMinuteTiles(
    hour: number,
    minute: number,
    tiles: CalendarTile<IEventTile>[]
  ): CalendarTile<IEventTile> | undefined {
    const eventTile = tiles.find(
      (tile) => tile.event.hour === hour && tile.event.minute === minute
    );
    return eventTile;
  }

  private getTileByTile(
    tile: CalendarTile<IEventTile>
  ): CalendarTile<IEventTile> | undefined {
    const day = tile.event.day || 0;
    const hour = tile.event.hour;
    const minute = tile.event.minute;

    const tiles = this.getEventTilesByDay(day) || [];
    const selectedTile = this.getEventTileByHourMinuteTiles(
      hour,
      minute,
      tiles
    );

    return selectedTile;
  }

  private getNewDateTime(
    nextTile: CalendarTile<IEventTile>,
    previousTile: CalendarTile<IEventTile>
  ): Date | AppointmentDateRange {
    const startDateTime = new Date(
      nextTile.event.year || 0,
      (nextTile.event.month || 0) - 1,
      nextTile.event.day
    );
    startDateTime.setHours(nextTile.event.hour, nextTile.event.minute, 0, 0);
    if (previousTile.event.appointment?.event.type === AppointmentTypes.EVENT) {
      const previousTileDateTime = previousTile.event.appointment?.event
        .dateTime as AppointmentDateRange;

      const { diffInHours, diffInMinutes } = this.getHoursAndMinutesDifference(
        previousTileDateTime.startDateTime,
        previousTileDateTime.endDateTime
      );

      const endDateTime = new Date(
        nextTile.event.year || 0,
        (nextTile.event.month || 0) - 1,
        nextTile.event.day
      );

      endDateTime.setHours(
        diffInHours + nextTile.event.hour,
        diffInMinutes + nextTile.event.minute,
        0,
        0
      );

      return { startDateTime, endDateTime };
    }
    return startDateTime;
  }

  private getHoursAndMinutesDifference(startDate: Date, endDate: Date) {
    const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMs / (1000 * 60)) % 60); 

    return {
      diffInHours,
      diffInMinutes,
    };
  }

  private getNextMonthlyDate(day: number | undefined, month: number): Date[] {
    const date = new Date();
    date.setFullYear(new Date().getFullYear(), month - 1, day);

    const days = [];

    for (let i = 1; i <= this.numberDaysCalendar; i++) {
      if (i !== 1) date.setDate(date.getDate() + 1);

      days.push(new Date(date));
    }

    return days;
  }

  private setWeekDaysTiles(date: Date = new Date()) {
    const currentDay = date.getDate();
    const currentMonth = date.getMonth();
    const days = this.getNextMonthlyDate(currentDay, currentMonth + 1);

    const tiles: CalendarTile<ICalendarTile>[] = days.map((day, index) =>
      CalendarTile.createTile<ICalendarTile>({
        text: day.getDate().toString(),
        cols: 3,
        rows: 2,
        column: index + 1,
        color: 'lightblue',
        month: day.getMonth(),
        year: day.getFullYear(),
      })
    );

    return tiles;
  }

  private setHourlyTiles(): CalendarTile<IEventTile>[] {
    const hours = Array.from({ length: 24 }, (_, index) => index);
    const tiles: CalendarTile<IEventTile>[] = [];

    hours.map((hour, index) => {
      tiles.push(
        CalendarTile.createTile<IEventTile>({
          text: `${hour <= 12 ? hour + ' AM' : hour - 12 + ' PM'}`,
          cols: 1,
          rows: 1,
          column: index + 1,
          color: 'lightgray',
          hour,
        })
      );
    });

    return tiles;
  }

  private getEventTiles(
    day: number,
    month: number,
    year: number
  ): CalendarTile<IEventTile>[] {
    const hours = Array.from({ length: 24 }, (_, index) => index);
    const minutes = [0, 15, 30, 45];
    const tiles: CalendarTile<IEventTile>[] = [];

    hours.map((hour, index) => {
      for (let i = 0; i < 4; i++) {
        tiles.push(
          CalendarTile.createTile<IEventTile>({
            text: '',
            cols: 1,
            rows: 1,
            column: index + 1,
            color: 'lightgray',
            hour,
            minute: minutes[i],
            day,
            month,
            year,
          })
        );
      }
    });

    return tiles;
  }

  private openAppointmentDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    date: Date,
    hour: number,
    minute: number
  ): void {
    this.dialog.open(AppointmentDialogComponent, {
      maxWidth: '650px',
      minWidth: '450px',
      width: '100%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        date,
        hour,
        minute,
      },
    });
  }
}
