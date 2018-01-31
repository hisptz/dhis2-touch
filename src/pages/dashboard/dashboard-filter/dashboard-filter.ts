import {Component, OnInit} from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../store/reducers/index';
import {Observable} from 'rxjs/Observable';
import {DashboardMenuItem} from '../../../models/dashboard-menu-item';
import * as fromDashboardSelectors from '../../../store/selectors/dashboard.selectors';
import * as fromDashboardActions from '../../../store/actions/dashboard.actions';
import {Dashboard} from '../../../models/dashboard';


/**
 * Generated class for the DashboardFilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dashboard-filter',
  templateUrl: 'dashboard-filter.html',
})
export class DashboardFilterPage implements OnInit{

  dashboards$: Observable<DashboardMenuItem[]>;
  currentDashboard$: Observable<Dashboard>;
  searchTerm: string;

  constructor(
    private viewCtrl: ViewController,
    private store: Store<ApplicationState>
  ) {
    this.dashboards$ = store.select(fromDashboardSelectors.getDashboardMenuItems);
    this.currentDashboard$ = store.select(fromDashboardSelectors.getCurrentDashboard);
  }

  ngOnInit() {
  }

  getFilteredList(event: any) {
    this.searchTerm = event.target.value;
  }

  setCurrentDashboard(selectedDashboard){
    this.store.dispatch(new fromDashboardActions.SetCurrentAction(selectedDashboard.id));
    this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
