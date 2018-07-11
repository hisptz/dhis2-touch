import { Component,Input } from '@angular/core';

/**
 * Generated class for the NotificationComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'notification',
  templateUrl: 'notification.html'
})
export class NotificationComponent {

  icon: string;
  @Input() message;

  constructor() {
    this.icon = 'assets/icon/notification.png';
  }

}
