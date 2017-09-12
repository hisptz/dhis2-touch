import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Generated class for the TextInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'text-input-field',
  templateUrl: 'text-input-field.html'
})
export class TextInputFieldComponent implements OnInit{

  @Input() dataElement;
  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit(){


  }

}
