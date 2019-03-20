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
import { Component, Input, OnInit } from '@angular/core';

/**
 * Generated class for the DataSetReportRowComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'data-set-report-row',
  templateUrl: 'data-set-report-row.html'
})
export class DataSetReportRowComponent implements OnInit {
  @Input() dataElement;
  @Input() appSettings;
  @Input() dataSetReportAggregateValues;

  fieldLabelKey: string;

  constructor() {}

  ngOnInit() {
    if (this.dataElement && this.dataElement.displayName) {
      this.fieldLabelKey = this.dataElement.displayName;
      let dataEntrySettings = this.appSettings.entryForm;
      if (dataEntrySettings.label) {
        if (
          this.dataElement[dataEntrySettings.label] &&
          isNaN(this.dataElement[dataEntrySettings.label])
        ) {
          this.fieldLabelKey = this.dataElement[dataEntrySettings.label];
        }
      }
    }
  }

  getListLayoutLabel(categoryComboName, categoryOptionComboName) {
    let label = this.fieldLabelKey;
    if (categoryComboName != 'default') {
      label += ' ' + categoryOptionComboName;
    }
    return label;
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }
}
