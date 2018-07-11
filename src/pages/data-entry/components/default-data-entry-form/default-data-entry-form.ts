import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the DefaultDataEntryFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'default-data-entry-form',
  templateUrl: 'default-data-entry-form.html'
})
export class DefaultDataEntryFormComponent implements OnInit {
  @Input() entryFormSections;
  @Input() entryFormType: string;
  @Input() pager;
  @Input() dataValuesSavingStatusClass;
  @Input() currentUser;
  @Input() dataValuesObject;
  @Input() dataSetsCompletenessInfo;
  @Input() isDataSetCompleted: boolean;
  @Input() isDataSetCompletenessProcessRunning: boolean;
  @Input() icons;

  @Output() onChange = new EventEmitter();
  @Output() onSectionListOpen = new EventEmitter();
  @Output() onViewUserCompletenessInformation = new EventEmitter();
  @Output() onPaginationChange = new EventEmitter();
  @Output() onUpdateDataSetCompleteness = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  updateDataSetCompleteness() {
    this.onUpdateDataSetCompleteness.emit();
  }

  openSectionList() {
    this.onSectionListOpen.emit();
  }

  viewUserCompletenessInformation(dataSetsCompletenessInfo) {
    this.onViewUserCompletenessInformation.emit(dataSetsCompletenessInfo);
  }

  changePagination(page) {
    this.onPaginationChange.emit(page);
  }

  updateData(event) {
    this.onChange.emit(event);
  }
}
