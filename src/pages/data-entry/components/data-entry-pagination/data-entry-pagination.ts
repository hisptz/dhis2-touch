/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
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
  @Input() isValidationProcessRunning: boolean;
  @Input() isPeriodLocked: boolean;

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
