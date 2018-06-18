import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the SynchronizationSettingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'synchronization-settings',
  templateUrl: 'synchronization-settings.html'
})
export class SynchronizationSettingsComponent {
  @Input() settingObject;
  @Output() onUpdateSyncSetting = new EventEmitter();

  constructor() {}

  updateAutoSyncSetting() {
    this.onUpdateSyncSetting.emit({});
  }
}
