import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Generated class for the BooleanInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'boolean-input-field',
  templateUrl: 'boolean-input-field.html'
})
export class BooleanInputFieldComponent implements OnInit{

  @Input() dataElement;
  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit(){

  }


}
