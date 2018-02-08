import { CurrentUser } from "./../../models/currentUser";
import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  MenuController,
  NavController,
  ModalController
} from "ionic-angular";
import { ApplicationState } from "../../store/reducers/index";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Dashboard } from "../../models/dashboard";
import { Visualization } from "../../models/visualization";
import * as fromDashboardSelectors from "../../store/selectors/dashboard.selectors";
import * as fromVisualizationSelectors from "../../store/selectors/visualization.selectors";
import * as fromCurrentUserSelectors from "../../store/selectors/currentUser.selectors";
import * as fromDashboardActions from "../../store/actions/dashboard.actions";
import * as fromVisualizationActions from "../../store/actions/visualization.actions";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-dashboard",
  templateUrl: "dashboard.html"
})
export class DashboardPage implements OnInit {
  currentDashboard$: Observable<Dashboard>;
  visualizationObjects$: Observable<Visualization[]>;
  loading$: Observable<boolean>;
  currentUser$: Observable<CurrentUser>;
  icons: any = {};
  opendeInterpreationsMapper: any = {};

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private store: Store<ApplicationState>,
    private menu: MenuController
  ) {
    this.currentDashboard$ = store.select(
      fromDashboardSelectors.getCurrentDashboard
    );
    this.loading$ = store.select(
      fromDashboardSelectors.getDashboardLoadingStatus
    );
    this.visualizationObjects$ = store.select(
      fromVisualizationSelectors.getCurrentDashboardVisualizationObjects
    );
    this.currentUser$ = store.select(fromCurrentUserSelectors.getCurrentUser);
  }

  ngOnInit() {
    this.menu.enable(true);
    this.icons = {
      menu: "assets/icon/menu.png",
      MAP: "assets/icon/map.png",
      CHART: "assets/icon/column.png",
      TABLE: "assets/icon/table.png",
      APP: "assets/icon/app.png",
      RESOURCES: "assets/icon/resource.png",
      REPORTS: "assets/icon/report.png",
      USERS: "assets/icon/users.png",
      MESSAGES: "assets/icon/filled-chat.png",
      INFO: "assets/icon/info.png"
    };
  }

  openDashboardListFilter() {
    let modal = this.modalCtrl.create("DashboardFilterPage", {});
    modal.onDidDismiss((dashboard: any) => {});
    modal.present();
  }

  toggleVisualization(visualizationObject: Visualization) {
    this.store.dispatch(
      new fromVisualizationActions.ToggleVisualizationAction(
        visualizationObject
      )
    );
  }

  toggleInterpretation(visualizationObject: Visualization) {
    if (!this.opendeInterpreationsMapper[visualizationObject.id]) {
      this.opendeInterpreationsMapper[visualizationObject.id] = false;
    }
    this.opendeInterpreationsMapper[visualizationObject.id] = !this
      .opendeInterpreationsMapper[visualizationObject.id];
  }

  currentVisualizationChange(
    visualizationType: string,
    visualizationObject: Visualization
  ) {
    this.store.dispatch(
      new fromVisualizationActions.VisualizationChangeAction({
        type: visualizationType,
        id: visualizationObject.id
      })
    );
    this.opendeInterpreationsMapper[visualizationObject.id] = false;
  }
}
