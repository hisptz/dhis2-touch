import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() isPasswordFormValid: boolean;
  @Input() isUserPasswordUpdateProcessActive: boolean;

  @Output() onChangePasswordFormField = new EventEmitter();
  @Output() onUpdateUserPassword = new EventEmitter();

  dataObject;
  formFields;

  constructor() {
    this.dataObject = {};
    this.formFields = [];
  }

  ngOnInit() {
    this.formFields = this.getUpdateUserPasswordForm();
  }

  updateValue(data, key) {
    const { value } = data;
    if (value && value.trim() !== '') {
      this.dataObject[key] = value;
      this.onChangePasswordFormField.emit({ id: key, value: value });
    }
  }

  updatePassword() {
    setTimeout(() => {
      const key = 'newPassword';
      const value = this.dataObject[key];
      this.onUpdateUserPassword.emit(value);
    }, 100);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getUpdateUserPasswordForm() {
    return [
      {
        id: 'oldPassword',
        displayName: 'Old password'
      },
      {
        id: 'newPassword',
        displayName: 'New password'
      },
      {
        id: 'newPasswordConfirmation',
        displayName: 'New password confirmation'
      }
    ];
  }
}
