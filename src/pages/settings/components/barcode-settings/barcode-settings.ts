import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the BarcodeSettingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'barcode-settings',
  templateUrl: 'barcode-settings.html'
})
export class BarcodeSettingsComponent {
  @Input() settingObject;
  @Output() onUpdateBarcodeSettings = new EventEmitter();

  constructor() {}

  applySettings() {
    this.onUpdateBarcodeSettings.emit({});
  }
}
