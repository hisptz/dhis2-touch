import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { ApplicationState } from '../../../store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Visualization } from '../../../models/visualization';
import * as fromCurrentUserSelectors from '../../../store/selectors/currentUser.selectors';
import * as fromVisualizationSelectors from '../../../store/selectors/visualization.selectors';
import * as fromVisualizationActions from '../../../store/actions/visualization.actions';
import { UnSetCurrentAction } from '../../../store/actions/visualization.actions';
import { CurrentUser } from '../../../models/currentUser';

/**
 * Generated class for the FullScreenDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-full-screen-dashboard',
  templateUrl: './full-screen-dashboard.html'
})
export class FullScreenDashboardPage implements OnInit {
  currentUser$: Observable<CurrentUser>;
  currentVisualization$: Observable<Visualization>;
  icons: any = {};

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private store: Store<ApplicationState>
  ) {
    this.currentUser$ = store.select(fromCurrentUserSelectors.getCurrentUser);
    this.currentVisualization$ = store.select(
      fromVisualizationSelectors.getCurrentVisualizationObject
    );
    this.icons = {
      menu: 'assets/icon/menu.png',
      MAP: 'assets/icon/map.png',
      CHART: 'assets/icon/column.png',
      TABLE: 'assets/icon/table.png',
      APP: 'assets/icon/app.png',
      RESOURCES: 'assets/icon/resource.png',
      REPORTS: 'assets/icon/report.png',
      USERS: 'assets/icon/users.png',
      MESSAGES: 'assets/icon/filled-chat.png',
      INFO: 'assets/icon/info.png'
    };
  }

  ngOnInit() {}

  closeDashboardItem(event) {
    event.stopPropagation();
    this.store.dispatch(new UnSetCurrentAction());
    this.navCtrl.pop();
  }
}
