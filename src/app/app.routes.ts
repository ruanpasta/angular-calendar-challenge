import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@calendar-challenge/calendar').then((lib) => lib.calendarRoutes),
  },
];
