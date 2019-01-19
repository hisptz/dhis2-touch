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
 * Generated class for the DataEntrySectionSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry-section-selection',
  templateUrl: 'data-entry-section-selection.html'
})
export class DataEntrySectionSelectionPage implements OnInit {
  pager: any;
  sections: Array<any>;
  currentSection: any;
  icon: string;
  translationMapper: any;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private appTranslation: AppTranslationProvider
  ) {
    this.translationMapper = {};
    this.icon = 'assets/icon/list.png';
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  ngOnInit() {
    this.pager = this.navParams.get('pager');
    this.sections = this.navParams.get('sections');

    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.sections = this.navParams.get('sections');
    if (val && val.trim() != '') {
      this.sections = this.sections.filter((section: any) => {
        return section.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  setSelectedSection(section) {
    this.pager.page = this.navParams.get('sections').indexOf(section) + 1;
    this.viewCtrl.dismiss(this.pager);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  getValuesToTranslate() {
    return ['There is nothing to select'];
  }
}
