import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AppointmentBase,
  AppointmentDateRange,
  AppointmentOptions,
  AppointmentRecurrenceTypes,
  AppointmentTypes,
  EventAppointment,
  TaskAppointment,
} from '../../core/models/Appointment.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AppointmentsService } from '../../core/services/appointments.service';
import Appointment from '../../core/models/Appointment';

@Component({
  selector: 'calendar-challenge-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
  ],
  template: `
    <div class="appointment-dialog-header">
      <button
        mat-icon-button
        mat-dialog-close
        color="primary"
        aria-label="Close button"
      >
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-dialog-content>
      <form
        [formGroup]="appointmentForm"
        (ngSubmit)="onSubmit()"
        class="appointment-form"
      >
        <mat-form-field appearance="fill" class="appointment-form-title">
          <mat-label>Title</mat-label>
          <input matInput placeholder="Add title" formControlName="title" />
        </mat-form-field>

        <button
          *ngFor="let type of appointmentsTypes"
          type="button"
          mat-button
          class="appointment-form-type"
          [id]="'appointment-form-' + type.toLowerCase()"
          (click)="updateType(type)"
        >
          {{ type }}
        </button>

        <div *ngIf="isType('Event')" class="appointment-form-times">
          <mat-form-field appearance="fill">
            <mat-label>Choose a date</mat-label>
            <input
              matInput
              [matDatepicker]="datepicker"
              formControlName="date"
              required
            />
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle
              matIconSuffix
              [for]="datepicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #datepicker>
              <mat-datepicker-actions>
                <button mat-button matDatepickerCancel>Cancel</button>
                <button mat-raised-button color="primary" matDatepickerApply>
                  Apply
                </button>
              </mat-datepicker-actions>
            </mat-datepicker>
            <mat-error
              *ngIf="
                appointmentForm.get('date')?.invalid &&
                (appointmentForm.get('date')?.dirty ||
                  appointmentForm.get('date')?.touched)
              "
            >
              <div *ngIf="appointmentForm.get('date')?.hasError('required')">
                Date is required
              </div>
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill" class="appointment-form-time">
            <mat-select formControlName="startTime" required>
              <mat-option *ngFor="let time of times" [value]="time">
                {{ time }}
              </mat-option>
            </mat-select>
            <mat-error
              *ngIf="
                appointmentForm.get('startTime')?.invalid &&
                (appointmentForm.get('startTime')?.dirty ||
                  appointmentForm.get('startTime')?.touched)
              "
            >
              <div
                *ngIf="appointmentForm.get('startTime')?.hasError('required')"
              >
                Start time is required
              </div>
            </mat-error>
          </mat-form-field>

          <div class="appointment-form-times-divider">&horbar;</div>

          <mat-form-field appearance="fill" class="appointment-form-time">
            <mat-select formControlName="endTime" required>
              <mat-option *ngFor="let time of times" [value]="time">
                {{ time }}
              </mat-option>
            </mat-select>
            <mat-error
              *ngIf="
                appointmentForm.get('endTime')?.invalid &&
                (appointmentForm.get('endTime')?.dirty ||
                  appointmentForm.get('endTime')?.touched)
              "
            >
              <div *ngIf="appointmentForm.get('endTime')?.hasError('required')">
                End time is required
              </div>
            </mat-error>
          </mat-form-field>
        </div>

        <div *ngIf="isType('Tasks')">tasks</div>

        <div *ngIf="isType('Reminder')">Reminder</div>

        <mat-dialog-actions class="appointment-dialog-buttons">
          <button mat-button>Save</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `,
  styles: [
    `
      .appointment-form-title {
        @apply w-full;
      }

      .appointment-dialog-header {
        @apply h-9 text-right;
      }

      .appointment-dialog-buttons {
        @apply flex justify-end;
      }

      .appointment-form-type {
        @apply mr-2 mb-2;
      }

      .appointment-form-times {
        @apply flex justify-start justify-items-center gap-2;
      }

      .appointment-form-time {
        @apply w-24;
      }

      .appointment-form-times-divider {
        @apply mt-4;
      }
    `,
  ],
})
export class AppointmentDialogComponent implements AfterViewInit, OnInit {
  appointmentForm = this.formBuilder.group({
    date: [undefined, Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    recurrence: [AppointmentRecurrenceTypes.DOES_NOT_REPEAT, Validators.required],
    type: [AppointmentTypes.EVENT, Validators.required],
    title: ['', Validators.max(250)],
    guests: [[]],
    location: [[]],
    description: ['', Validators.max(1000)],
    allDay: [false],
    tasks: [''],
  });

  appointmentsTypes = Object.values(AppointmentTypes);

  times: string[] = this.getTimes();

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.setStartEndTime('00:00', '01:00');
  }

  ngAfterViewInit(): void {
    this.updateType(AppointmentTypes.EVENT);
  }

  updateType(type: AppointmentTypes) {
    this.appointmentForm.get('type')?.setValue(type);

    for (const appointmentType of this.appointmentsTypes) {
      const element = document.getElementById(
        `appointment-form-${appointmentType.toLowerCase()}`
      ) as HTMLElement;

      if (appointmentType === type) element.style.backgroundColor = 'lightblue';
      else element.style.backgroundColor = 'transparent';
    }
    console.log(this.appointmentForm.get('type')?.value);
  }

  isType(type: string): boolean {
    return this.appointmentForm.get('type')?.value === type;
  }

  onSubmit() {
    if (!this.appointmentForm.valid)
      return this.validateForm(this.appointmentForm);

    const appointment = this.getAppointment(this.appointmentForm);

    console.log(appointment)

    this.appointmentService.create(appointment);

    this.dialogRef.close();
  }

  private getAppointment(
    appointmentForm: FormGroup
  ): Appointment<AppointmentOptions> {
    const {
      date,
      startTime,
      endTime,
      title,
      type,
      guests,
      location,
      description,
      recurrence,
      allDay,
      tasks
    } = appointmentForm.value;

    switch (type) {
      case AppointmentTypes.TASK: {
        const dateTime = this.getDate(date, startTime, endTime);
        return Appointment.createAppointment<AppointmentOptions>({
          dateTime,
          recurrence,
          title,
          type,
          allDay,
          description,
          tasks,
        });
      }
      case AppointmentTypes.REMINDER: {
        const dateTime = this.getDate(date, startTime, endTime);
        return Appointment.createAppointment<AppointmentBase>({
          dateTime,
          recurrence,
          title,
          type,
          allDay
        });
      }
      default: {
        const dateTime = this.getDate(date, startTime, endTime);
        return Appointment.createAppointment<EventAppointment>({
          dateTime,
          title,
          type,
          description,
          location,
          guests,
          recurrence,
          allDay
        })
      }
    }
  }

  private getDate(
    date: Date,
    startTime: string,
    endTime: string,
    range = true
  ): Date | AppointmentDateRange {
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const startDateTime = new Date(`${formattedDate} ${startTime}`);
    if (!range) return startDateTime;
    const endDateTime = new Date(`${formattedDate} ${endTime}`);
    return { startDateTime, endDateTime };
  }

  private getTimes(): string[] {
    return Array.from({ length: 24 * 4 }, (_, index) => {
      const hour = Math.floor(index / 4);
      const minute = (index % 4) * 15;
      return `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
    });
  }

  private setStartEndTime(start: string, end: string) {
    this.appointmentForm.get('startTime')?.setValue(start);
    this.appointmentForm.get('endTime')?.setValue(end);
  }

  private validateForm(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];
      if (control instanceof FormGroup) this.validateForm(control);
      else control.markAsDirty();
    });
  }
}
