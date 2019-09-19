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
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { AppColorObject, Option } from 'src/models';

@Component({
  selector: 'app-option-set-selection',
  templateUrl: './option-set-selection.page.html',
  styleUrls: ['./option-set-selection.page.scss']
})
export class OptionSetSelectionPage implements OnInit {
  selectedValue: string;
  options: Array<Option[]>;
  optionListTitle: string;
  currentIndex: number;
  cancelIcon: string;
  isDisabled: boolean;
  colorSettings$: Observable<AppColorObject>;

  constructor(
    private modalController: ModalController,
    private navParms: NavParams,
    private store: Store<State>
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.cancelIcon = 'assets/icon/cancel.png';
    this.currentIndex = 0;
    this.options = [];
  }

  ngOnInit() {
    this.optionListTitle = this.navParms.get('optionListTitle');
    this.selectedValue = this.navParms.get('selectedValue');
    const options: Option[] = this.navParms.get('options');
    const isDisabled: boolean = this.navParms.get('isDisabled');
    this.isDisabled = isDisabled || false;
    this.setOptionSetSelections(options);
  }

  getFilteredList(data: { target: { value: string } }) {
    const value = data.target.value || '';
    const options: Option[] = _.filter(
      this.navParms.get('options'),
      (option: Option) => {
        const { code, name } = option;
        return (
          name.toLowerCase().includes(value.toLowerCase()) ||
          code.toLowerCase().includes(value.toLowerCase())
        );
      }
    );
    this.setOptionSetSelections(options);
  }

  previousPage() {
    this.currentIndex--;
  }

  nextPage() {
    this.currentIndex++;
  }

  async clearValue() {
    const option = { id: '', name: '', code: '' };
    await this.closeModal(option);
  }

  async setSelectedOption(option?: Option) {
    await this.closeModal(option);
  }

  setOptionSetSelections(data: Option[]) {
    this.currentIndex = 0;
    const pageSize = 250;
    this.options = _.chunk(data, pageSize);
  }

  async closeModal(data?: Option) {
    await this.modalController.dismiss(data);
  }

  trackByFn(index: any, option: Option) {
    return option && option.id ? option.id : index;
  }
}
