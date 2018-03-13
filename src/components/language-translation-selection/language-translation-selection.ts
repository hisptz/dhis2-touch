import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';

/**
 * Generated class for the LanguageTranslationSelectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'language-translation-selection',
  templateUrl: 'language-translation-selection.html'
})
export class LanguageTranslationSelectionComponent implements OnInit {
  @Input() translationCodes: any;
  @Input() currentLanguage: string;
  @Output() onClose = new EventEmitter();
  @Output() onSelectLanguage = new EventEmitter();
  cancelIcon: string;
  backupTranslationCodes: any;
  translationMapper: any;
  constructor(private appTranslation: AppTranslationProvider) {}

  ngOnInit() {
    this.cancelIcon = 'assets/icon/cancel.png';
    this.backupTranslationCodes = this.translationCodes;
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }

  closeContainer() {
    this.onClose.emit({});
  }

  selectLanguage(translationCode) {
    this.onSelectLanguage.emit(translationCode.code);
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.translationCodes = this.backupTranslationCodes;
    if (val && val.trim() != '') {
      this.translationCodes = this.translationCodes.filter(
        (translationCode: any) => {
          return (
            translationCode.name.toLowerCase().indexOf(val.toLowerCase()) >
              -1 ||
            translationCode.code.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
        }
      );
    }
  }

  getValuesToTranslate() {
    return ['Search'];
  }
}
