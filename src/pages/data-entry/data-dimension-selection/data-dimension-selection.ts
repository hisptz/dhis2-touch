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
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the DataDimensionSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-dimension-selection',
  templateUrl: 'data-dimension-selection.html'
})
export class DataDimensionSelectionPage implements OnInit {
  categoryOptions: any;
  currentSelection: any;
  icon: string;
  title: string = 'Data dimension selection';
  translationMapper;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private appTranslation: AppTranslationProvider
  ) {
    this.icon = 'assets/icon/form.png';
    this.translationMapper = {};
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.currentSelection = this.navParams.get('currentSelection');
    this.title = this.navParams.get('title');
    this.categoryOptions = this.navParams.get('categoryOptions');
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.categoryOptions = this.navParams.get('categoryOptions');
    if (val && val.trim() != '') {
      this.categoryOptions = this.categoryOptions.filter(
        (categoryOption: any) => {
          return (
            categoryOption.name.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
        }
      );
    }
  }

  setSelectedCategoryOption(categoryOption) {
    this.viewCtrl.dismiss(categoryOption);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  getValuesToTranslate() {
    return ['There is no option to select'];
  }
}
