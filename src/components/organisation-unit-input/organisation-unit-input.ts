import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Generated class for the OrganisationUnitInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'organisation-unit-input',
  templateUrl: 'organisation-unit-input.html'
})
export class OrganisationUnitInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
