import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Generated class for the DateInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'date-input-field',
  templateUrl: 'date-input-field.html'
})
export class DateInputFieldComponent implements OnInit{

  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit(){


  }

}
