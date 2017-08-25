import { Component } from '@angular/core';

/**
 * Generated class for the ClearLocalDataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'clear-local-data',
  templateUrl: 'clear-local-data.html'
})
export class ClearLocalDataComponent {

  text: string;

  constructor() {
    console.log('Hello ClearLocalDataComponent Component');
    this.text = 'Hello World';
  }

}
