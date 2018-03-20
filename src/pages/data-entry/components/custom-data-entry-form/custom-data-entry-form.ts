import { Component, Input, OnInit } from '@angular/core';

/**
 * Generated class for the CustomDataEntryFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-data-entry-form',
  templateUrl: 'custom-data-entry-form.html'
})
export class CustomDataEntryFormComponent implements OnInit {
  @Input() dataEntryFormDesign;

  constructor() {
    console.log('Inside custom data entry form');
  }

  ngOnInit() {}
}
