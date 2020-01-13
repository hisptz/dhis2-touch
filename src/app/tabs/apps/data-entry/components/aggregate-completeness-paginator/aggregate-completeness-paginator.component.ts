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
import { Component, OnInit, Input } from '@angular/core';
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

  isPaginationVisiable: boolean;

  constructor() {}

  ngOnInit() {
    this.isPaginationVisiable =
      this.entryFormType === 'SECTION' &&
      this.pager &&
      this.entryFormSections &&
      this.entryFormSections.length > 1;
  }
}
