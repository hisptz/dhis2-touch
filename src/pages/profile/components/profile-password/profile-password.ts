import { Component, OnInit, Input } from '@angular/core';

/**
 * Generated class for the ProfilePasswordComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profile-password',
  templateUrl: 'profile-password.html'
})
export class ProfilePasswordComponent implements OnInit {
  @Input() currentUser;
  @Input() dataEntrySettings;
  @Input() barcodeSettings;

  dataObject;

  constructor() {
    this.dataObject = {};
  }

  ngOnInit() {}

  updateValue(data) {}
}
