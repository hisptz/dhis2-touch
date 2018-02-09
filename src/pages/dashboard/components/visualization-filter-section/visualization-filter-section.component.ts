import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export const INITIAL_FILTER_CONFIG = {
  showLayout: true,
  showData: true
};

@Component({
  selector: 'app-visualization-filter-section',
  templateUrl: './visualization-filter-section.component.html',
})
export class VisualizationFilterSectionComponent implements OnInit {

  @Input() selectedDimensions: any;
  @Input() visualizationType: string;
  @Input() loaded: boolean;
  @Input() filterConfig: any;
  @Input() showFilters: boolean;
  @Output() onFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLayoutUpdate:  EventEmitter<any> = new EventEmitter<any>();
  selectedFilter: string;

  constructor() {
    this.showFilters = false;
    this.filterConfig = INITIAL_FILTER_CONFIG;
  }

  ngOnInit() {


  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    this.selectedFilter = selectedFilter;
  }

  onFilterUpdateAction(filterValue: any, filterType: string) {

    this.selectedFilter = undefined;

    if (filterType === 'LAYOUT') {
      this.onLayoutUpdate.emit(filterValue);
    } else {
      this.onFilterUpdate.emit(filterValue);
    }
  }

}
