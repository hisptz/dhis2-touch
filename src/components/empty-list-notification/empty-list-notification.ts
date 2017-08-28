import { Component, Input} from '@angular/core';
import {ResourceProvider} from "../../providers/resource/resource";

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

  constructor(ResourceProvider : ResourceProvider) {
    this.imageUrl = ResourceProvider.getEmptyListNotificationIcon();
  }

}
