import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Generated class for the TrueOnlyInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'true-only-input-field',
  templateUrl: 'true-only-input-field.html'
})
export class TrueOnlyInputFieldComponent implements OnInit{

  @Input() dataElement;
  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit(){


  }

}
