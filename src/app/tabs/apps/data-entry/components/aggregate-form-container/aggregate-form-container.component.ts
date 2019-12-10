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
import { CurrentEntrySelection, AppColorObject } from 'src/models';
import { DataEntryFormService } from '../../services/data-entry-form.service';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-aggregate-form-container',
  templateUrl: './aggregate-form-container.component.html',
  styleUrls: ['./aggregate-form-container.component.scss']
})
export class AggregateFormContainerComponent implements OnInit {
  @Input() currentEntrySelection: CurrentEntrySelection;
  @Input() isPeriodLocked: boolean;
  @Input() colorSettings: AppColorObject;

  @Output() entryFormStatusChange = new EventEmitter();

  isLoading: boolean;

  constructor(
    private dataEntryFormService: DataEntryFormService,
    private toasterMessagesService: ToasterMessagesService
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    const dataSetId = this.currentEntrySelection.selectedDataSet.id;
    this.discoveringDataSetInformation(dataSetId);
  }

  async discoveringDataSetInformation(dataSetId: string) {
    const dataSetInformation = await this.dataEntryFormService.discoveringDataSetInformation(
      dataSetId
    );
    const { data, error } = dataSetInformation;
    if (!error) {
      const { dataSet, sectionIds, indicatorIds } = data;
      console.log({ dataSet, sectionIds, indicatorIds });
    } else {
      const message = `Error : ${error}`;
      this.toasterMessagesService.showToasterMessage(message);
    }
  }

  async discoveringIndicators(indicatorIds: string[]) {}

  async discoveringEntryFormMetadata() {}

  async discoveringComponsaryEntryFields() {}

  async discoverigValidationRules() {}

  async discoverigOfflineDataValues() {}
}
