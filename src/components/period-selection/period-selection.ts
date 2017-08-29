import { Component } from '@angular/core';

/**
 * Generated class for the PeriodSelectionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'period-selection',
  templateUrl: 'period-selection.html'
})
export class PeriodSelectionComponent {

  text: string;

  constructor() {
    console.log('Hello PeriodSelectionComponent Component');
    this.text = 'Hello World';
  }

}
