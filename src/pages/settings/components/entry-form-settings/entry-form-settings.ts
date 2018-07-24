import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the EntryFormSettingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'entry-form-settings',
  templateUrl: 'entry-form-settings.html'
})
export class EntryFormSettingsComponent {
  @Input() settingObject;
  @Output() onUpdateDataEntrySettings = new EventEmitter();

  constructor() {}

  applySettings() {
    this.onUpdateDataEntrySettings.emit({});
  }
}
