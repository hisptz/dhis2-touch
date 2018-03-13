import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

/*
  Generated class for the AppTranslationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppTranslationProvider {
  constructor(private translateService: TranslateService) {}

  /**
   *
   * @param {string} lang
   */
  setAppTranslation(lang?: string) {
    if (!lang) {
      lang = this.getCurrentLanguage();
    }
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
  }

  /**
   *
   * @returns {string}
   */
  getCurrentLanguage() {
    let lang = 'en';
    if (this.translateService.getDefaultLang()) {
      lang = this.translateService.getDefaultLang();
    }
    return lang;
  }

  /**
   *
   * @param stringToTranslate
   * @returns {Observable<any>}
   */
  getTransalations(stringToTranslate: Array<string>): Observable<any> {
    return this.translateService.get(stringToTranslate);
  }

  /**
   *
   * @returns {Array}
   */
  getTopThreeSupportedTranslationCodes() {
    let topThreeTransalationCodes = [];
    this.getSupportedTranslationObjects().map((translationObject: any) => {
      if (topThreeTransalationCodes.length < 3) {
        topThreeTransalationCodes.push(translationObject.code);
      }
    });
    return topThreeTransalationCodes;
  }

  /**
   *
   * @returns {Array<{code: string; name: string}>
   */
  getSupportedTranslationObjects() {
    return [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French' },
      { code: 'pt-PT', name: 'Portuguese (Portugal)' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'af', name: 'Afrikaans' },
      { code: 'am', name: 'Amharic' },
      { code: 'ar', name: 'Arabic' },
      { code: 'bn', name: 'Bengali' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'zh-TW', name: 'Chinese (Traditional)' },
      { code: 'da', name: 'Danish' },
      { code: 'ht', name: 'Haitian Creole' },
      { code: 'ha', name: 'Hausa' },
      { code: 'hi', name: 'Hindi' },
      { code: 'id', name: 'Indonesian' },
      { code: 'lo', name: 'Laothian' },
      { code: 'mn', name: 'Mongolian' },
      { code: 'ne', name: 'Nepali' },
      { code: 'no', name: 'Norwegian' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'ru', name: 'Russian' },
      { code: 'st', name: 'Sesotho' },
      { code: 'sn', name: 'Shona' },
      { code: 'sd', name: 'Sindhi' },
      { code: 'si', name: 'Sinhalese' },
      { code: 'so', name: 'Somali' },
      { code: 'es', name: 'Spanish' },
      { code: 'es-419', name: 'Spanish (Latin American)' },
      { code: 'su', name: 'Sundanese' },
      { code: 'sw', name: 'Swahili' },
      { code: 'sv', name: 'Swedish' },
      { code: 'tg', name: 'Tajik' },
      { code: 'ta', name: 'Tamil' },
      { code: 'ur', name: 'Urdu' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'xh', name: 'Xhosa' },
      { code: 'zu', name: 'Zulu' }
    ];
  }
}
