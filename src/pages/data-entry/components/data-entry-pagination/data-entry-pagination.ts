import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the DataEntryPaginationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'data-entry-pagination',
  templateUrl: 'data-entry-pagination.html'
})
export class DataEntryPaginationComponent implements OnInit {
  @Input() isDataSetCompletenessProcessRunning;
  @Input() pager;
  @Input() entryFormType;
  @Input() entryFormSectionsCount;
  @Input() isDataSetCompleted;
  @Input() dataSetsCompletenessInfo;

  @Output() onViewUserCompletenessInformation = new EventEmitter();
  @Output() onSectionListOpen = new EventEmitter();
  @Output() onPaginationChange = new EventEmitter();
  @Output() onUpdateDataSetCompleteness = new EventEmitter();

  constructor() {}
  ngOnInit() {}

  updateDataSetCompleteness() {
    this.onUpdateDataSetCompleteness.emit();
  }

  viewUserCompletenessInformation(dataSetsCompletenessInfo) {
    this.onViewUserCompletenessInformation.emit(dataSetsCompletenessInfo);
  }

  changePagination(page) {
    this.onPaginationChange.emit(page);
  }

  openSectionList() {
    this.onSectionListOpen.emit();
  }
}
