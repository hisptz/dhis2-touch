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
  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit(){


  }

}
