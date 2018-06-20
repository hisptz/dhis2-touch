import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the AppSettingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-settings',
  templateUrl: 'app-settings.html'
})
export class AppSettingsComponent {
  @Input() currentLanguage;
  @Input() translationCodes;

  @Output() onUpdateCurrentLanguage = new EventEmitter();

  constructor() {}

  updateCurrentLanguage() {
    this.onUpdateCurrentLanguage.emit(this.currentLanguage);
  }
}
