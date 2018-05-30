import { Component, Input } from '@angular/core';

/**
 * Generated class for the EventDateNotificationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'event-date-notification',
  templateUrl: 'event-date-notification.html'
})
export class EventDateNotificationComponent {
  @Input() notification: string;

  icon: string;

  constructor() {
    this.icon = 'assets/icon/event-capture.png';
  }
}
