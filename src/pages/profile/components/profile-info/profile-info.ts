import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() dataValuesSavingStatusClass;

  @Output() onProfileInfoUpdate = new EventEmitter();

  numericalInputField;
  textInputField;
  dataObject: any = {};
  isLoading: boolean;

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

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  updateValue(data) {
    this.data.status = false;
    if (data && data.id) {
      const { id } = data;
      const { value } = data;
      this.dataValuesSavingStatusClass[id] = 'input-field-container-saving';
      this.dataObject[id] = data;
      const dataId = id.split('-profile')[0];
      this.data[dataId] = value;
      this.onProfileInfoUpdate.emit({ data: this.data, id: id });
    }
  }
}
