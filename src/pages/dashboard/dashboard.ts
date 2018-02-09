import { CurrentUser } from "./../../models/currentUser";
import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  MenuController,
  NavController,
  ModalController
} from "ionic-angular";
import * as _ from "lodash";
import { ApplicationState } from "../../store/reducers/index";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Dashboard } from "../../models/dashboard";
import { Visualization } from "../../models/visualization";
import * as fromDashboardSelectors from "../../store/selectors/dashboard.selectors";
import * as fromVisualizationSelectors from "../../store/selectors/visualization.selectors";
import * as fromCurrentUserSelectors from "../../store/selectors/currentUser.selectors";
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

  getSelectedDimensions(visualizationObject) {
    return visualizationObject.details &&
      visualizationObject.details.filters.length > 0 &&
      visualizationObject.details.layouts.length > 0
      ? {
          selectedDataItems: this.getSelectedItems(
            visualizationObject.details.filters,
            "dx"
          ),
          selectedPeriods: this.getSelectedItems(
            visualizationObject.details.filters,
            "pe"
          ),
          orgUnitModel: this._getSelectedOrgUnitModel(
            this.getSelectedItems(visualizationObject.details.filters, "ou")
          ),
          layoutModel: visualizationObject.details.layouts[0].layout
        }
      : null;
  }

  getSelectedItems(filters: any[], dimension: string) {
    // todo take data items based on the current layer
    if (filters && filters[0]) {
      const dataItemObject = _.find(filters[0].filters, ["name", dimension]);

      if (dataItemObject) {
        return _.map(dataItemObject.items, (dataItem: any) => {
          return {
            id: dataItem.dimensionItem,
            name: dataItem.displayName,
            type: dataItem.dimensionItemType
          };
        });
      }
    }
    return [];
  }

  private _getSelectedOrgUnitModel(orgUnitArray): any {
    const selectedOrgUnitLevels = orgUnitArray.filter(
      orgunit => orgunit.id.indexOf("LEVEL") !== -1
    );
    const selectedUserOrgUnits = orgUnitArray.filter(
      orgunit => orgunit.id.indexOf("USER") !== -1
    );
    const selectedOrgUnitGroups = orgUnitArray.filter(
      orgunit => orgunit.id.indexOf("OU_GROUP") !== -1
    );

    return {
      selectionMode:
        selectedOrgUnitLevels.length > 0
          ? "Level"
          : selectedOrgUnitGroups.length > 0 ? "Group" : "orgUnit",
      selectedLevels: selectedOrgUnitLevels.map(orgunitlevel => {
        return {
          level: orgunitlevel.id.split("-")[1]
        };
      }),
      showUpdateButton: true,
      selectedGroups: selectedOrgUnitGroups,
      orgUnitLevels: [],
      orgUnitGroups: [],
      selectedOrgUnits: orgUnitArray.filter(
        (orgUnit: any) => orgUnit.type === "ORGANISATION_UNIT"
      ),
      userOrgUnits: [],
      type: "report",
      selectedUserOrgUnits: selectedUserOrgUnits.map(userorgunit => {
        return {
          id: userorgunit.id,
          shown: true
        };
      }),
      orgUnits: []
    };
  }

  onFilterUpdate(filterValue: any, visualizationObject: Visualization) {
    this.store.dispatch(
      new fromVisualizationActions.LocalFilterChangeAction({
        visualizationObject: visualizationObject,
        filterValue: filterValue
      })
    );
  }

  onLayoutUpdate(layoutOptions: any, visualizationObject: Visualization) {
    const newVisualizationObjectDetails = {
      ...visualizationObject.details
    };

    // TODO use only single place for saving layout options
    const visualizationLayouts = _.map(
      newVisualizationObjectDetails.layouts,
      (layoutObject: any) => {
        return {
          ...layoutObject,
          layout: layoutOptions
        };
      }
    );

    const visualizationLayers = _.map(
      visualizationObject.layers,
      (layer: any) => {
        return {
          ...layer,
          layout: layoutOptions
        };
      }
    );

    this.store.dispatch(
      new fromVisualizationActions.AddOrUpdateAction({
        visualizationObject: {
          ...visualizationObject,
          details: {
            ...newVisualizationObjectDetails,
            layouts: [...visualizationLayouts]
          },
          layers: visualizationLayers
        },
        placementPreference: "normal"
      })
    );
  }
}
