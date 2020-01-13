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
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import * as _ from 'lodash';
import { DataEntryFormSection, ItemPager } from 'src/models';

@Component({
  selector: 'app-default-entry-form',
  templateUrl: './default-entry-form.component.html',
  styleUrls: ['./default-entry-form.component.scss']
})
export class DefaultEntryFormComponent implements OnInit, OnChanges {
  @Input() isPeriodLocked: boolean;
  @Input() isDataSetCompleted: boolean;
  @Input() entryFormSections: DataEntryFormSection[];
  @Input() data: any;
  @Input() pager: ItemPager;

  @Output() openSectionListAction = new EventEmitter();

  icon: string;
  lockingFieldStatus: boolean;

  constructor() {
    this.icon = 'assets/icon/menu.png';
  }

  ngOnInit() {
    this.pager = this.pager || {
      page: 1,
      total: this.entryFormSections.length
    };
    this.lockingFieldStatus = this.isDataSetCompleted || this.isPeriodLocked;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['isDataSetCompleted'] &&
      !changes['isDataSetCompleted'].firstChange
    ) {
      this.lockingFieldStatus = this.isDataSetCompleted || this.isPeriodLocked;
    }
  }

  trackByFn(index: any, item: any) {
    return item && item.id ? item.id : index;
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
