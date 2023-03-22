import { NgModule } from '@angular/core';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

@NgModule({
  declarations: [],
  imports: [AppointmentDialogComponent, CalendarViewComponent],
  exports: [AppointmentDialogComponent, CalendarViewComponent],
})
export class ComponentsModule {}
