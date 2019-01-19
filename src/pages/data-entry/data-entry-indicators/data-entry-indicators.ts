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
import { IndicatorsProvider } from '../../../providers/indicators/indicators';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the DataEntryIndicatorsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry-indicators',
  templateUrl: 'data-entry-indicators.html'
})
export class DataEntryIndicatorsPage implements OnInit {
  indicators: any;
  indicatorToValue: any;
  title: string = "Entry form's indicators";
  colorSettings$: Observable<any>;

  constructor(
    private store: Store<State>,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private indicatorProvider: IndicatorsProvider
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.indicators = [];
    this.indicatorToValue = {};
  }

  ngOnInit() {
    this.indicators = this.navParams.get('indicators');
    const dataValuesObject = this.navParams.get('dataValuesObject');
    const dataSet = this.navParams.get('dataSet');
    if (dataSet && dataSet.name) {
      this.title = dataSet.name + "'s indicators";
    }
    const { indicatorToValue } = this.indicatorProvider.getIndicatorValues(
      this.indicators,
      dataValuesObject
    );
    if (indicatorToValue) {
      this.indicatorToValue = indicatorToValue;
    }
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }
}
