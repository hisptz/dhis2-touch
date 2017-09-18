import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Generated class for the OptionSetInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'option-set-input-field',
  templateUrl: 'option-set-input-field.html'
})
export class OptionSetInputFieldComponent implements OnInit{

  @Input() dataElement;
  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit(){

  }

}
