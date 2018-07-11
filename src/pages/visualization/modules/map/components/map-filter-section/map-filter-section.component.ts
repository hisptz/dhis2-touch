import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { getDimensionItems } from '../../utils/analytics';
import * as fromStore from '../../store';

@Component({
  selector: 'app-map-filter-section',
  templateUrl: './map-filter-section.component.html',
  animations: [
    trigger('open', [
      state(
        'in',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(700)
      ]),
      transition('* => void', [
        animate(300),
        style({
          opacity: 0
        })
      ])
    ])
  ]
})
export class MapFilterSectionComponent implements OnInit, OnDestroy {
  @Input() mapVisualizationObject;
  @Input() activeLayer;
  @Input() loaded: boolean = true;

  @Output() onFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLayoutUpdate: EventEmitter<any> = new EventEmitter<any>();

  showFilters: boolean;
  selectedFilter: string = 'ORG_UNIT';
  selectedDataItems: any = [];
  selectedPeriods: any = [];
  selectedLayer;
  public legendSets$;
  public singleSelection: boolean = true;
  public periodConfig: any = {
    singleSelection: true
  };
  orgUnitModel: any = {
    selectionMode: 'orgUnit',
    selectedLevels: [],
    showUpdateButton: true,
    selectedGroups: [],
    orgUnitLevels: [],
    orgUnitGroups: [],
    selectedOrgUnits: [],
    userOrgUnits: [],
    type: 'report', // can be 'data_entry'
    selectedUserOrgUnits: []
  };

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.showFilters = true;
    const { layers } = this.mapVisualizationObject;
    this.selectedLayer = layers[this.activeLayer];
    const { dataSelections } = this.selectedLayer;
    this.getSelectedFilters(dataSelections);
    this.legendSets$ = this.store.select(fromStore.getAllLegendSets);
  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
    this.store.dispatch(
      new fromStore.ToggleVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    this.selectedFilter = selectedFilter;
  }

  onFilterUpdateAction(filterValue: any, filterType: string) {
    const activeLayerIndex = this.activeLayer;
    const { layers, componentId } = this.mapVisualizationObject;
    const layer = layers[activeLayerIndex];
    const { value, items } = filterValue;

    // TODO: Refactor all these switch statements.

    switch (filterType) {
      case 'ORG_UNIT':
        const _items = items.map(item => ({ displayName: item.name, dimesionItem: item.id }));
        const newdimension = {
          dimension: 'ou',
          items: _items
        };
        const payload = {
          componentId,
          filterType: 'ou',
          layer,
          newdimension,
          params: value
        };
        this.store.dispatch(new fromStore.UpdateOUSelection(payload));
        break;
      case 'PERIOD':
        const peItems = items.map(item => ({
          displayName: item.name,
          dimesionItem: item.id,
          dimensionItemType: 'PERIOD'
        }));
        const newPeDimension = {
          dimension: 'pe',
          items: peItems
        };
        this.store.dispatch(
          new fromStore.UpdatePESelection({
            componentId,
            filterType: 'pe',
            layer,
            newdimension: newPeDimension,
            params: value
          })
        );
        break;
      case 'DATA':
        const dxItems = filterValue.itemList.map(item => ({
          displayName: item.name,
          dimesionItem: item.id
        }));
        const newDxDimension = {
          dimension: 'dx',
          items: dxItems
        };
        this.store.dispatch(
          new fromStore.UpdateDXSelection({
            componentId,
            filterType: 'dx',
            layer,
            newdimension: newDxDimension,
            params: filterValue.selectedData.value
          })
        );
        break;
      default:
        break;
    }
  }

  onStyleFilterUpdate({ layer }) {
    const activeLayerIndex = this.activeLayer;
    const { layers, componentId } = this.mapVisualizationObject;
    const updatedLayers = layers.map(
      (_layer, index) => (index === activeLayerIndex ? layer : _layer)
    );
    this.store.dispatch(
      new fromStore.UpdateLayerStyle({ ...this.mapVisualizationObject, layers: updatedLayers })
    );
  }

  onFilterClose(event) {
    this.store.dispatch(
      new fromStore.CloseVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }

  getSelectedFilters(dataSelections) {
    const { columns, rows, filters } = dataSelections;
    const data = [...columns, ...filters, ...rows];
    const selectedPeriods = getDimensionItems('pe', data);
    const selectedDataItems = getDimensionItems('dx', data);
    this.selectedDataItems = selectedDataItems.map(dataItem => ({
      id: dataItem.dimensionItem,
      name: dataItem.displayName,
      type: dataItem.dimensionItemType
    }));

    this.selectedPeriods = selectedPeriods.map(periodItem => ({
      id: periodItem.dimensionItem,
      name: periodItem.displayName,
      type: periodItem.dimensionItemType
    }));
    const orgUnitArray = getDimensionItems('ou', data);

    let selectedOrgUnits = [];
    let selectedLevels = [];
    let selectedGroups = [];
    let selectedUserOrgUnits = [];
    orgUnitArray.map(orgunit => {
      if (orgunit.dimensionItemType && orgunit.dimensionItemType === 'ORGANISATION_UNIT') {
        const orgUnit = {
          id: orgunit.dimensionItem,
          name: orgunit.displayName,
          type: orgunit.dimensionItemType
        };
        selectedOrgUnits = [...selectedOrgUnits, orgUnit];
      }
      if (orgunit.dimensionItem.indexOf('LEVEL') !== -1) {
        const level = {
          level: orgunit.dimensionItem.split('-')[1]
        };
        selectedLevels = [...selectedLevels, level];
      }

      if (orgunit.dimensionItem.indexOf('OU_GROUP') !== -1) {
        selectedGroups = [
          ...selectedGroups,
          {
            id: orgunit.dimesionItem,
            name: orgunit.displayName
          }
        ];
      }
      if (orgunit.dimensionItem.indexOf('USER') !== -1) {
        selectedUserOrgUnits = [
          ...selectedUserOrgUnits,
          {
            id: orgunit.dimensionItem,
            name: orgunit.displayName
          }
        ];
      }
    });

    this.orgUnitModel = {
      ...this.orgUnitModel,
      selectedLevels: selectedLevels || [],
      selectedOrgUnits: selectedOrgUnits || [],
      selectedUserOrgUnits: selectedUserOrgUnits || [],
      selectedGroups: selectedGroups || []
    };
  }

  ngOnDestroy() {
    this.store.dispatch(
      new fromStore.CloseVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }
}
