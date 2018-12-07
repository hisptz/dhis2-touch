import { Component } from '@angular/core';

/**
 * Generated class for the TrackerConflictHandlerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tracker-conflict-handler',
  templateUrl: 'tracker-conflict-handler.html'
})
export class TrackerConflictHandlerComponent {

  text: string;

  constructor() {
    console.log('Hello TrackerConflictHandlerComponent Component');
    this.text = 'Hello World';
  }

}
