import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'calendar-challenge-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent {
  selected: Date = new Date();
}
