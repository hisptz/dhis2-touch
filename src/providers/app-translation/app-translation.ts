import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";

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
}
