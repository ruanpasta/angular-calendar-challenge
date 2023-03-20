enum AppointmentTypes {
  EVENT = 'Event',
  TASK = 'Tasks',
  REMINDER = 'Reminder',
}

interface AppointmentDateRange {
  startDateTime: Date;
  endDateTime: Date;
}

enum AppointmentRecurrenceTypes {
  DOES_NOT_REPEAT = 'Does not repeat',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTLY = 'Montly',
  ANNUALLY = 'Annually',
  EVERY_WEEKDAY = 'Every weekday',
}

interface AppointmentBase {
  id?: string;
  dateTime: Date | AppointmentDateRange;
  recurrence: AppointmentRecurrenceTypes;
  title?: string;
  type?: AppointmentTypes;
  allDay?: boolean;
}

interface TaskAppointment extends AppointmentBase {
  description?: string;
  tasks?: string;
}

interface EventAppointment extends AppointmentBase {
  guests?: string[];
  location?: string;
  description?: string;
}

interface AppointmentOptions extends EventAppointment, TaskAppointment, AppointmentBase {};

export {
  AppointmentBase,
  EventAppointment,
  TaskAppointment,
  AppointmentDateRange,
  AppointmentTypes,
  AppointmentRecurrenceTypes,
  AppointmentOptions
};
