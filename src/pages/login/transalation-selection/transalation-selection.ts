/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';
import { Translation } from '../../../models/translation';

/**
 * Generated class for the TransalationSelectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transalation-selection',
  templateUrl: 'transalation-selection.html'
})
export class TransalationSelectionPage implements OnInit {
  cancelIcon: string;
  translationCodes: Array<Translation>;
  currentLanguage: string;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private appTranslationProvider: AppTranslationProvider
  ) {
    this.translationCodes = this.appTranslationProvider.getSupportedTranslationObjects();
  }

  ngOnInit() {
    const data = this.navParams.get('data');
    const { currentLanguage } = data;
    this.currentLanguage = currentLanguage;
    this.cancelIcon = 'assets/icon/cancel.png';
  }

  selectLanguage(translationCode: Translation) {
    this.viewCtrl.dismiss(translationCode.code);
  }

  getFilteredList(data) {
    const value = data.target.value;
    if (value && value.trim() != '') {
      this.translationCodes = this.appTranslationProvider.getSupportedTranslationObjects();
      this.translationCodes = this.translationCodes.filter(
        (translationCode: any) => {
          return (
            translationCode.name.toLowerCase().indexOf(value.toLowerCase()) >
              -1 ||
            translationCode.code.toLowerCase().indexOf(value.toLowerCase()) > -1
          );
        }
      );
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  trackByFn(index, item: Translation) {
    return item && item.code ? item.code : index;
  }
}
