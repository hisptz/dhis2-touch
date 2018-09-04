import { Component, Input} from '@angular/core';

/**
 * Generated class for the EmptyListNotificationComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'empty-list-notification',
  templateUrl: 'empty-list-notification.html'
})
export class EmptyListNotificationComponent {

  @Input() emptyListMessage;

  imageUrl : string;

  constructor() {
    this.imageUrl = 'assets/icon/empty-list-box.png';
  }

}
