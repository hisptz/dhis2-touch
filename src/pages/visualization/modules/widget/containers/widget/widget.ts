import { Component, Input } from '@angular/core';

/**
 * Generated class for the WidgetComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'widget',
  templateUrl: './widget.html'
})
export class WidgetComponent {

  @Input() height: string;
  constructor() {

  }

}
