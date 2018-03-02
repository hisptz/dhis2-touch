import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppTranslationProvider } from '../../../../providers/app-translation/app-translation';

export const INITIAL_FILTER_CONFIG = {
  showLayout: true,
  showData: true
};

@Component({
  selector: 'app-visualization-filter-section',
  templateUrl: './visualization-filter-section.component.html'
})
export class VisualizationFilterSectionComponent implements OnInit {
  @Input() selectedDimensions: any;
  @Input() visualizationType: string;
  @Input() loaded: boolean;
  @Input() filterConfig: any;
  @Input() showFilters: boolean;
  @Output() onFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLayoutUpdate: EventEmitter<any> = new EventEmitter<any>();
  selectedFilter: string;
  translationMapper: any;

  constructor(private appTranslation: AppTranslationProvider) {
    this.showFilters = false;
    this.filterConfig = INITIAL_FILTER_CONFIG;
  }

  ngOnInit() {
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.selectedFilter = undefined;
    } else {
      this.selectedFilter = '';
    }
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

  getValuesToTranslate() {
    return ['Data', 'Period', 'Org-unit', 'Layout'];
  }
}
