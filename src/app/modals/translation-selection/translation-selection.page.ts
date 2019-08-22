/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import * as _ from 'lodash';
import { AppColorObject, Translation } from 'src/models';

@Component({
  selector: 'app-translation-selection',
  templateUrl: './translation-selection.page.html',
  styleUrls: ['./translation-selection.page.scss']
})
export class TranslationSelectionPage implements OnInit {
  cancelIcon: string;
  currentLanguage: string;
  filterItems: Translation[] = [];
  colorSettings$: Observable<AppColorObject>;

  constructor(
    private modalController: ModalController,
    private navParms: NavParams,
    private store: Store<State>
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.cancelIcon = 'assets/icon/cancel.png';
    this.filterItems = [];
  }

  ngOnInit() {
    this.currentLanguage = this.navParms.get('currentLanguage');
    this.filterItems = this.navParms.get('translationCodes');
  }

  async setCurrentTranslation(currrentTransalation: Translation) {
    await this.closeModal(currrentTransalation);
  }

  async closeModal(currrentTransalation?: Translation) {
    await this.modalController.dismiss(currrentTransalation);
  }

  getFilteredList(data: { target: { value: string } }) {
    const value = data.target.value || '';
    const translationCodes = this.navParms.get('translationCodes');
    this.filterItems = _.filter(
      translationCodes,
      (translationCode: Translation) => {
        const { name, code } = translationCode;
        return (
          name.toLowerCase().includes(value.toLowerCase()) ||
          code.toLowerCase().includes(value.toLowerCase())
        );
      }
    );
  }

  trackByFn(index: any, item: Translation) {
    return item && item.code ? item.code : index;
  }
}
