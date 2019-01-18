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
import { PeriodSelectionProvider } from '../../providers/period-selection/period-selection';
import { AppTranslationProvider } from '../../providers/app-translation/app-translation';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the PeriodSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-period-selection',
  templateUrl: 'period-selection.html'
})
export class PeriodSelectionPage implements OnInit {
  periodType: string;
  openFuturePeriods: number;
  currentPeriodOffset: number;
  currentPeriod: any;
  translationMapper: any;
  periods: Array<any>;
  icon: string;
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private periodSelection: PeriodSelectionProvider,
    private appTranslation: AppTranslationProvider
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.icon = 'assets/icon/period.png';
  }

  ngOnInit() {
    this.periodType = this.navParams.get('periodType');
    this.openFuturePeriods = parseInt(this.navParams.get('openFuturePeriods'));
    this.currentPeriodOffset = parseInt(
      this.navParams.get('currentPeriodOffset')
    );
    this.currentPeriod = this.navParams.get('currentPeriod');
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
        this.loadPeriodSelection();
      },
      error => {
        this.loadPeriodSelection();
      }
    );
  }

  loadPeriodSelection() {
    this.periods = [];
    let periods = this.periodSelection.getPeriods(
      this.periodType,
      this.openFuturePeriods,
      this.currentPeriodOffset
    );
    if (periods.length > 0) {
      this.periods = periods;
    } else {
      this.currentPeriodOffset = this.currentPeriodOffset - 1;
      this.loadPeriodSelection();
    }
  }

  changePeriodSelection(currentPeriodOffset) {
    this.currentPeriodOffset = currentPeriodOffset;
    this.loadPeriodSelection();
  }

  setSelectedPeriod(selectedPeriod) {
    this.periodSelection.setLastSelectedPeriod(selectedPeriod.name);
    this.viewCtrl.dismiss({
      selectedPeriod: selectedPeriod,
      currentPeriodOffset: this.currentPeriodOffset
    });
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  trackByFn(index, item) {
    return item && item.iso ? item.iso : index;
  }

  getValuesToTranslate() {
    return ['There is no period to select'];
  }
}
