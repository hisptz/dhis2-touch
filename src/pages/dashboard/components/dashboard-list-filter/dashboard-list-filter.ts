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
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { Dashboard } from '../../models/dashboard.model';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../../store';
import { DashboardState, getAllDashboards } from '../../store/reducers';
import { Observable } from 'rxjs/Observable';
import { getCurrentDashboard } from '../../store/selectors/dashboard.selectors';
import { SetCurrentDashboardAction } from '../../store/actions/dashboard.actions';

@IonicPage()
@Component({
  selector: 'page-dashboard-list-filter',
  templateUrl: 'dashboard-list-filter.html'
})
export class DashboardListFilterPage implements OnInit {
  dashboards$: Observable<Dashboard[]>;
  currentDashboard$: Observable<Dashboard>;
  searchTerm: string;
  colorSettings$: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<DashboardState>,
    private appStore: Store<State>,
    private viewCtrl: ViewController
  ) {
    this.colorSettings$ = appStore.select(getCurrentUserColorSettings);
    this.dashboards$ = store.select(getAllDashboards);
    this.currentDashboard$ = store.select(getCurrentDashboard);
  }

  ngOnInit() {}
  ionViewDidLoad() {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onDashboardSearch(e) {
    this.searchTerm = e.target.value;
  }

  onSetCurrentDashboard(dashboard: Dashboard) {
    this.store.dispatch(new SetCurrentDashboardAction(dashboard.id));
    this.dismiss();
  }
}
