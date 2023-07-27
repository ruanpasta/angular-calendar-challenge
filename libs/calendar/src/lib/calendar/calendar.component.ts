import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ComponentsModule } from '../components/componets.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../components/appointment-dialog/appointment-dialog.component';

@Component({
  selector: 'calendar-challenge-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ComponentsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  selected: Date = new Date();

  constructor(public dialog: MatDialog) {}

  openAppointmentDialog(): void {
    this.dialog.open(AppointmentDialogComponent, {
      maxWidth: '650px',
      minWidth: '450px',
      width: '100%',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '150ms',
      data: {
        date: this.selected,
        hour: this.selected.getHours(),
        minute: this.selected.getMinutes()
      },
    });
  }
}
