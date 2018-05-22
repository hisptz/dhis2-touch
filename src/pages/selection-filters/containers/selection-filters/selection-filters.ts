import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { VisualizationDataSelection } from '../../../visualization/models/visualization-data-selection.model';

/**
 * Generated class for the SelectionFiltersComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'selection-filters',
  templateUrl: './selection-filters.html'
})
export class SelectionFiltersComponent implements OnInit {

  @Input() dataSelections: VisualizationDataSelection[];
  @Output() filterUpdate: EventEmitter<VisualizationDataSelection[]> = new EventEmitter<VisualizationDataSelection[]>();
  showFilters: boolean;
  showFilterBody: boolean;
  selectedFilter: string;

  constructor() {
    this.showFilters = this.showFilterBody = false;
    this.selectedFilter = 'DATA';
  }

  get selectedData(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'dx']);
    return dataObject ? dataObject.items : [];
  }


  get selectedPeriods(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'pe']);
    return dataObject ? dataObject.items : [];
  }


  get selectedOrgUnits(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'ou']);
    return dataObject ? dataObject.items : [];
  }

  ngOnInit() {

  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showFilterBody = true;
    } else {
      this.showFilterBody = false;
    }
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    if (this.selectedFilter === selectedFilter) {
      this.selectedFilter = '';
      this.showFilterBody = false;
    } else {
      this.selectedFilter = selectedFilter;
      this.showFilterBody = true;
    }
  }

  onFilterClose(selectedItems, selectedFilter) {
    if (selectedItems && selectedItems.items.length > 0) {
      this.dataSelections = [...this.updateDataSelectionWithNewSelections(this.dataSelections, selectedItems)];
    }

    if (this.selectedFilter === selectedFilter) {
      this.selectedFilter = '';
      this.showFilterBody = false;
    }
  }

  onFilterUpdate(selectedItems) {
    this.dataSelections = [...this.updateDataSelectionWithNewSelections(this.dataSelections, selectedItems)];
    this.filterUpdate.emit(this.dataSelections);
    this.selectedFilter = '';
    this.showFilterBody = false;
  }

  updateDataSelectionWithNewSelections(dataSelections: VisualizationDataSelection[],
    selectedObject: any): VisualizationDataSelection[] {
    const selectedDimension = _.find(dataSelections, ['dimension', selectedObject.dimension]);
    const selectedDimensionIndex = dataSelections.indexOf(selectedDimension);
    return selectedDimension ? [
      ...dataSelections.slice(0, selectedDimensionIndex),
      {...selectedDimension, ...selectedObject},
      ...dataSelections.slice(selectedDimensionIndex + 1)
    ] : dataSelections;
  }

}
