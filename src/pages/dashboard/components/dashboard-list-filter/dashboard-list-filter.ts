import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Dashboard } from '../../models/dashboard.model';
import { Store } from '@ngrx/store';
import { DashboardState, getAllDashboards } from '../../store/reducers';
import { Observable } from 'rxjs/Observable';
import { getCurrentDashboard } from '../../store/selectors/dashboard.selectors';
import { SetCurrentDashboardAction } from '../../store/actions/dashboard.actions';


@IonicPage()
@Component({
  selector: 'page-dashboard-list-filter',
  templateUrl: 'dashboard-list-filter.html',
})
export class DashboardListFilterPage implements OnInit{

  dashboards$: Observable<Dashboard[]>;
  currentDashboard$: Observable<Dashboard>;
  searchTerm: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private store: Store<DashboardState>, private viewCtrl: ViewController) {
    this.dashboards$ = store.select(getAllDashboards);
    this.currentDashboard$ = store.select(getCurrentDashboard);
  }

  ngOnInit() {

  }
  ionViewDidLoad() {
  }

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
