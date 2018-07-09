import { Component, OnInit, Input } from '@angular/core';

/**
 * Generated class for the ProfileInfoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profile-info',
  templateUrl: 'profile-info.html'
})
export class ProfileInfoComponent implements OnInit {
  @Input() data;
  @Input() currentUser;
  @Input() profileInfoForm;
  @Input() dataEntrySettings;
  @Input() barcodeSettings;

  numericalInputField;
  textInputField;
  dataObject: any = {};
  isLoading: boolean;
  dataValuesSavingStatusClass: any = {};
  constructor() {
    this.isLoading = true;
    this.numericalInputField = [
      'INTEGER_NEGATIVE',
      'INTEGER_POSITIVE',
      'INTEGER',
      'NUMBER',
      'INTEGER_ZERO_OR_POSITIVE'
    ];
    this.textInputField = ['TEXT', 'LONG_TEXT'];
  }

  ngOnInit() {
    Object.keys(this.data).map(key => {
      if (key !== 'status') {
        const id = key + '-profile';
        this.dataObject[id] = { id: id, value: this.data[key] };
      }
    });
    this.isLoading = false;
  }

  updateValue(data) {
    this.data.status = false;
    console.log('Data : ' + JSON.stringify(data));
  }
}
