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
import {
  IonicPage,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { DashboardState } from './store/reducers/';
import { LoadDashboardsAction } from './store/actions/dashboard.actions';
import { Observable } from 'rxjs/Observable';
import {
  getCurrentDashboard,
  getDashboardLoadingStatus
} from './store/selectors/dashboard.selectors';
import { Dashboard } from './models';
import { getCurrentDashboardVisualizations } from './store/selectors/dashboard-visualizations.selectors';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit {
  currentDashboard$: Observable<Dashboard>;
  currentDashboardVisualizations$: Observable<Array<string>>;
  loading$: Observable<boolean>;
  colorSettings$: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<DashboardState>,
    private appStore: Store<State>,
    public modalCtrl: ModalController
  ) {
    this.colorSettings$ = appStore.select(getCurrentUserColorSettings);
    this.currentDashboard$ = store.select(getCurrentDashboard);
    this.currentDashboardVisualizations$ = store.select(
      getCurrentDashboardVisualizations
    );
    this.loading$ = store.select(getDashboardLoadingStatus);
  }

  ionViewDidLoad() {}

  ngOnInit() {
    this.store.dispatch(new LoadDashboardsAction());
  }

  openDashboardListFilter() {
    let modal = this.modalCtrl.create('DashboardListFilterPage', {});
    modal.onDidDismiss(() => {});
    modal.present();
  }
}
