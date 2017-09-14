import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Generated class for the NumericalInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'numerical-input-field',
  templateUrl: 'numerical-input-field.html'
})
export class NumericalInputFieldComponent implements OnInit{

  @Input() dataElement;
  @Input() valueType;
  @Output() onChange = new EventEmitter();

  //this.numericalInputField = ['INTEGER_NEGATIVE','INTEGER_POSITIVE','INTEGER','NUMBER','INTEGER_ZERO_OR_POSITIVE'];

  constructor() {}

  ngOnInit(){


  }

}
