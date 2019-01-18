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
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the OptionListModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-option-list-modal',
  templateUrl: 'option-list-modal.html'
})
export class OptionListModalPage implements OnInit {
  title: string;
  arrayOfOptions: Array<any>;
  arrayOfOptionsBackup: Array<any>;
  isLoading: boolean;
  currentPage: number;
  currentValue: string;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.arrayOfOptions = [];
    this.arrayOfOptionsBackup = [];
    this.title = 'Options selections';
    this.isLoading = true;
    this.currentPage = 1;
    this.currentValue = '';
  }

  ngOnInit() {
    const data = this.navParams.get('data');
    const { title } = data;
    const { currentValue } = data;
    const { options } = data;
    if (title) {
      this.title = title;
    }
    if (options) {
      this.arrayOfOptions = this.getOptionsWithPaginations(options);
      this.arrayOfOptionsBackup = this.arrayOfOptions;
    }
    if (currentValue) {
      this.currentValue = currentValue;
    }
    this.isLoading = false;
  }

  getItems(event: any) {
    let value = event.target.value;
    if (value && value.trim() != '') {
      const data = this.navParams.get('data');
      const options = data.options.filter((option: any) => {
        return option.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
      this.arrayOfOptions = this.getOptionsWithPaginations(options);
      this.currentPage = 1;
    } else {
      if (this.arrayOfOptions.length != this.arrayOfOptionsBackup.length) {
        this.arrayOfOptions = this.arrayOfOptionsBackup;
        this.currentPage = 1;
      }
    }
  }

  clearValue() {
    const option = { name: 'Empty code', id: 'empty-code', code: '' };
    this.selectOption(option);
  }

  selectOption(option) {
    this.viewCtrl.dismiss(option);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  previousPage() {
    this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.arrayOfOptions.length) {
      this.currentPage++;
    }
  }

  getOptionsWithPaginations(options) {
    const pageSize = 250;
    return _.chunk(options, pageSize);
  }

  getSubArryByPagination(array, pageSize, pageNumber) {
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
