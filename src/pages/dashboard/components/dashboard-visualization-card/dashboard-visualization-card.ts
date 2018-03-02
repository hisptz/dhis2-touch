import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Visualization } from '../../../../models/visualization';
import { CurrentUser } from '../../../../models/currentUser';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../../store';
import * as _ from 'lodash';
import * as fromVisualizationActions from '../../../../store/actions/visualization.actions';

/**
 * Generated class for the DashboardVisualizationCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'dashboard-visualization-card',
  templateUrl: 'dashboard-visualization-card.html'
})
export class DashboardVisualizationCardComponent implements OnInit {
  @Input() visualizationObject: Visualization;
  @Input() currentUser: CurrentUser;
  @Output() onOpeningFullScreen: EventEmitter<any> = new EventEmitter();

  isInterpreationOpened: boolean;
  constructor(private store: Store<ApplicationState>) {}

  ngOnInit() {
    this.isInterpreationOpened = false;
  }

  toggleInterpretation() {
    this.isInterpreationOpened = !this.isInterpreationOpened;
  }

  openDashboardInFullScreen() {
    this.onOpeningFullScreen.emit(this.visualizationObject.id);
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
    this.isInterpreationOpened = false;
  }

  getSelectedDimensions(visualizationObject) {
    return visualizationObject.details &&
      visualizationObject.details.filters.length > 0 &&
      visualizationObject.details.layouts.length > 0
      ? {
          selectedDataItems: this.getSelectedItems(
            visualizationObject.details.filters,
            'dx'
          ),
          selectedPeriods: this.getSelectedItems(
            visualizationObject.details.filters,
            'pe'
          ),
          orgUnitModel: this._getSelectedOrgUnitModel(
            this.getSelectedItems(visualizationObject.details.filters, 'ou')
          ),
          layoutModel: visualizationObject.details.layouts[0].layout
        }
      : null;
  }

  getSelectedItems(filters: any[], dimension: string) {
    // todo take data items based on the current layer
    if (filters && filters[0]) {
      const dataItemObject = _.find(filters[0].filters, ['name', dimension]);

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
      orgunit => orgunit.id.indexOf('LEVEL') !== -1
    );
    const selectedUserOrgUnits = orgUnitArray.filter(
      orgunit => orgunit.id.indexOf('USER') !== -1
    );
    const selectedOrgUnitGroups = orgUnitArray.filter(
      orgunit => orgunit.id.indexOf('OU_GROUP') !== -1
    );

    return {
      selectionMode:
        selectedOrgUnitLevels.length > 0
          ? 'Level'
          : selectedOrgUnitGroups.length > 0 ? 'Group' : 'orgUnit',
      selectedLevels: selectedOrgUnitLevels.map(orgunitlevel => {
        return {
          level: orgunitlevel.id.split('-')[1]
        };
      }),
      showUpdateButton: true,
      selectedGroups: selectedOrgUnitGroups,
      orgUnitLevels: [],
      orgUnitGroups: [],
      selectedOrgUnits: orgUnitArray.filter(
        (orgUnit: any) => orgUnit.type === 'ORGANISATION_UNIT'
      ),
      userOrgUnits: [],
      type: 'report',
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
        placementPreference: 'normal'
      })
    );
  }
}
