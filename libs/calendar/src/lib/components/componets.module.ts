import { NgModule } from '@angular/core';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { CalendarWeeklyComponent } from './calendarWeekly/calendar-weekly.component';

@NgModule({
  declarations: [],
  imports: [CalendarWeeklyComponent, AppointmentDialogComponent, CalendarViewComponent],
  exports: [CalendarWeeklyComponent, AppointmentDialogComponent, CalendarViewComponent],
})
export class ComponentsModule {}
