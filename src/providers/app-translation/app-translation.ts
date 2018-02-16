import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";
import * as _ from "lodash";

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
    let lang = "en";
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
      if (topThreeTransalationCodes.length <= 3) {
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
      { code: "en", name: "English" },
      { code: "fr", name: "French" },
      { code: "pt", name: "Portuguese" },
      { code: "id", name: "Indonesian" },
      { code: "hi", name: "Hindi" },
      { code: "ar", name: "Arabic" },
      { code: "vi", name: "Vietnamese" },
      { code: "sw", name: "Swahili" },
      { code: "am", name: "Amharic (Ethiopia)" },
      { code: "es", name: "Spanish" },
      { code: "no", name: "Norwegian" }
    ];
  }
}
