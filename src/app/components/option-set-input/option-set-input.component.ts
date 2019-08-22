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
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { OptionSetSelectionPage } from 'src/app/modals/option-set-selection/option-set-selection.page';
import { Option, EntryFormSetting } from 'src/models';
import { DEFAULT_SETTINGS } from 'src/constants';

@Component({
  selector: 'app-option-set-input',
  templateUrl: './option-set-input.component.html',
  styleUrls: ['./option-set-input.component.scss']
})
export class OptionSetInputComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() optionListTitle: string;
  @Input() dataEntrySettings: EntryFormSetting;
  @Input() data: any;
  @Input() options: Option[];
  @Input() lockingFieldStatus: boolean;

  @Output() optionSetChange = new EventEmitter();

  shouldRenderAsRadio: boolean;
  fieldId: string;
  inputFieldValue: string;
  inputValueLabel: string;
  maximumNumberOfOptionAsRadio: number;

  constructor(private modalController: ModalController) {
    this.shouldRenderAsRadio = true;
    this.inputFieldValue = '';
    this.inputValueLabel = '';
    this.maximumNumberOfOptionAsRadio =
      DEFAULT_SETTINGS.entryForm.maximumNumberOfOptionAsRadio;
  }

  ngOnInit() {
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    this.options = this.options || [];
    this.dataEntrySettings =
      this.dataEntrySettings || DEFAULT_SETTINGS.entryForm;
    this.optionListTitle = this.optionListTitle || 'Option selection';
    this.fieldId = id;
    this.data = this.data || {};
    if (this.data && this.data[id]) {
      const value = this.data[id].value;
      this.inputFieldValue = value;
      const option: Option = this.getSelectedOption(value);
      if (option && option.name) {
        this.inputValueLabel = option.name;
      }
    }
    this.setDisplayPropertiesForOptionSet();
  }

  setDisplayPropertiesForOptionSet() {
    if (this.dataEntrySettings) {
      this.maximumNumberOfOptionAsRadio =
        this.dataEntrySettings.maximumNumberOfOptionAsRadio ||
        this.maximumNumberOfOptionAsRadio;
      if (this.dataEntrySettings.shouldDisplayAsRadio) {
        this.shouldRenderAsRadio =
          this.options.length <= this.maximumNumberOfOptionAsRadio;
      } else {
        this.shouldRenderAsRadio = false;
      }
    }
  }

  getSelectedOption(value: string): Option {
    return _.find(this.options, (option: Option) => {
      return option.code === value;
    });
  }

  async openOptionSetSelectionModal() {
    const modal = await this.modalController.create({
      component: OptionSetSelectionPage,
      componentProps: {
        selectedValue: this.inputFieldValue,
        options: this.options,
        optionListTitle: this.optionListTitle
      },
      cssClass: 'inset-modal'
    });
    modal.present();
    const response = await modal.onDidDismiss();
    if (response && response.data) {
      const { data } = response;
      const { code } = data;
      this.onUpdateOptionValue(code);
    }
  }

  onUpdateOptionValue(value: string) {
    this.inputValueLabel = value;
    this.inputFieldValue = value;
    const option: Option = this.getSelectedOption(value);
    if (option && option.name) {
      this.inputValueLabel = option.name;
    }
    const id = `${this.dataElementId}-${this.categoryOptionComboId}`;
    const status = 'not-sync';
    this.optionSetChange.emit({ id, value, status });
  }
}
