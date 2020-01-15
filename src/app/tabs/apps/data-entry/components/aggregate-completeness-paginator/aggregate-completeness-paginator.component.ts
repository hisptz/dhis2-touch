/*
 *
 * Copyright 2019 HISP Tanzania
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
 * @since 2019
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { DataEntryFormSection, ItemPager } from 'src/models';

@Component({
  selector: 'app-aggregate-completeness-paginator',
  templateUrl: './aggregate-completeness-paginator.component.html',
  styleUrls: ['./aggregate-completeness-paginator.component.scss']
})
export class AggregateCompletenessPaginatorComponent implements OnInit {
  @Input() entryFormSections: DataEntryFormSection[];
  @Input() entryFormType: string;
  @Input() pager: ItemPager;
  @Input() isDataSetCompleted: boolean;
  @Input() isValidationProcessRunning: boolean;
  @Input() isDataSetCompletenessProcessRunning: boolean;
  @Input() isPeriodLocked: boolean;

  @Output() openSectionListAction = new EventEmitter();
  @Output() dataSetCompletenessAction = new EventEmitter();
  @Output() validationRuleAction = new EventEmitter();

  isPaginationVisiable: boolean;

  constructor() {}

  ngOnInit() {
    this.isPaginationVisiable =
      this.entryFormType === 'SECTION' &&
      this.pager &&
      this.entryFormSections &&
      this.entryFormSections.length > 1;
  }

  onDataSetCompletenessAction() {
    this.dataSetCompletenessAction.emit();
  }

  onValidationRuleAction() {
    this.validationRuleAction.emit();
  }

  onOpenSectionListAction() {
    const sections = _.map(
      this.entryFormSections,
      (section: DataEntryFormSection) => {
        const { id, name } = section;
        return { id, name };
      }
    );
    const data = { pager: this.pager, sections };
    this.openSectionListAction.emit(data);
  }
}
