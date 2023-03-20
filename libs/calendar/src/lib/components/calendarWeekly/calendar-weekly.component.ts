import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { ICalendarTile, IEventTile } from '../../core/models/Tiles.interface';
import CalendarTile from '../../core/models/CalendarTile';
import { AppointmentsService } from '../../core/services/appointments.service';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  AppointmentBase,
  AppointmentDateRange,
  AppointmentOptions,
  AppointmentTypes,
  EventAppointment,
  TaskAppointment,
} from '../../core/models/Appointment.interface';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import Appointment from '../../core/models/Appointment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'calendar-challenge-calendar-weekly',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    DragDropModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './calendar-weekly.component.html',
  styleUrls: ['./calendar-weekly.component.scss'],
})
export class CalendarWeeklyComponent implements OnInit, OnChanges, OnDestroy {
  selected: Date = new Date();
  weekDaysTiles: CalendarTile<ICalendarTile>[] = [];
  hourlyTiles: CalendarTile<IEventTile>[] = [];
  @Input() numberDaysCalendar = 7;
  @Input() selectedDay: Date = new Date();
  calendarColumns = 22;
  appointments: Appointment<AppointmentOptions>[] = [];
  appointmentSubscrption: Subscription = new Subscription;

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
    this.updateCalendar(true);
  }

  ngOnDestroy(): void {
    this.appointmentSubscrption.unsubscribe();
  }

  updateCalendar(isChange?: boolean) {
    this.weekDaysTiles = this.setWeekDaysTiles(this.selectedDay);
    this.hourlyTiles = this.setHourlyTiles();
    if (isChange) this.setAppointmentsElements();
  }

  setAppointmentsElements() {
    this.appointments.map((appointment) => {
      if (appointment.event.type === AppointmentTypes.EVENT) {
        const startDateTime = (
          appointment.event.dateTime as AppointmentDateRange
        ).startDateTime;
        const endDateTime = (appointment.event.dateTime as AppointmentDateRange)
          .endDateTime;
        const hour = startDateTime.getHours();
        const minute = startDateTime.getMinutes();

        const selectedDay = this.weekDaysTiles.find(
          (day) => day.event.text === startDateTime.getDate().toString()
        );
        const hourlyTilesDay = this.hourlyTiles.filter(
          (tile) => tile.event.column === selectedDay?.event.column
        );

        console.log(this.hourlyTiles);
        const indexHour = hourlyTilesDay.findIndex(
          (hourTime) => hourTime.event.hour === hour
        );
        const indexMinute = hourlyTilesDay[indexHour]?.event.minutes.findIndex(
          (minuteTime) => minuteTime === minute
        );

        const appointmentMinute =
          hourlyTilesDay[indexHour]?.event.minutes[indexMinute];

        if (typeof appointmentMinute === 'number')
          hourlyTilesDay[indexHour].event.minutes[indexMinute] = appointment;
      }
    });
  }

  onDrop(event: CdkDragDrop<any[]>) {
    console.log('dorrppp');
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onDeleteAppointment(
    value: number | Appointment<AppointmentOptions>,
    indexHourly: number,
    indexMinutes: number
  ) {
    const appointment = value as Appointment<AppointmentOptions>;
    this.hourlyTiles[indexHourly].event.minutes.splice(indexMinutes, 1);
    this.appointmentService.delete(appointment);
  }

  isAppointment(value: number | Appointment<AppointmentOptions>) {
    return typeof value !== 'number';
  }
  getappointmentTitle(value: number | Appointment<AppointmentOptions>) {
    const appointment = value as Appointment<AppointmentOptions>;
    return appointment.event.title || 'No title';
  }

  getNextMonthlyDays(day: number | undefined, month: number) {
    const date = new Date();
    date.setFullYear(new Date().getFullYear(), month - 1, day);

    const days = [];

    for (let i = 1; i <= this.numberDaysCalendar; i++) {
      if (i !== 1) date.setDate(date.getDate() + 1);

      days.push(date.getDate());
    }

    return days;
  }

  setWeekDaysTiles(date: Date = new Date()) {
    const currentDay = date.getDate();
    const currentMonth = date.getMonth();
    const days = this.getNextMonthlyDays(currentDay, currentMonth);

    const tiles: CalendarTile<ICalendarTile>[] = days.map((day, index) =>
      CalendarTile.createTile<ICalendarTile>({
        text: day.toString(),
        cols: 3,
        rows: 2,
        column: index + 1,
        color: 'lightblue',
      })
    );

    tiles.unshift(
      CalendarTile.createTile<ICalendarTile>({
        cols: 1,
        rows: 2,
        color: 'lightblue',
      })
    );

    return tiles;
  }

  setHourlyTiles(): CalendarTile<IEventTile>[] {
    const hours = Array.from({ length: 24 }, (_, index) => index + 1);
    const tiles: CalendarTile<IEventTile>[] = [];

    hours.map((hour) => {
      tiles.push(
        CalendarTile.createTile<IEventTile>({
          text: `${hour <= 12 ? hour + ' AM' : hour - 12 + ' PM'}`,
          cols: 1,
          rows: 1,
          color: 'lightpink',
        })
      );

      for (let i = 0; i < this.numberDaysCalendar; i++) {
        tiles.push(
          CalendarTile.createTile<IEventTile>({
            cols: 3,
            rows: 1,
            column: i + 1,
            color: 'lightgray',
            hour,
          })
        );
      }
    });

    return tiles;
  }

  onCalendarOrEventTileClick(
    eventTile: CalendarTile<ICalendarTile> | CalendarTile<IEventTile>,
    event: Event,
    minute?: number
  ) {
    console.log('Tile clicked:', eventTile, minute, event);
    this.openAppointmentDialog('300ms', '150ms');
  }

  openAppointmentDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AppointmentDialogComponent, {
      maxWidth: '650px',
      minWidth: '450px',
      width: '100%',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
