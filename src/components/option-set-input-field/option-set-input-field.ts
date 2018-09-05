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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, ModalOptions } from 'ionic-angular';

/**
 * Generated class for the OptionSetInputFieldComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'option-set-input-field',
  templateUrl: 'option-set-input-field.html'
})
export class OptionSetInputFieldComponent implements OnInit {
  @Input() dataElementId: string;
  @Input() categoryOptionComboId: string;
  @Input() optionListTitle: string;
  @Input() dataEntrySettings;
  @Input() data;
  @Input() options;
  @Output() onChange = new EventEmitter();
  inputFieldValue: string;
  labelMapper: any;
  maxOptionCountAsRadion: number;
  fieldId: string;
  //{"id":"s46m5MS0hxu-Prlt0C1RF0s","value":"1","status":"synced"}
  //id = dataElementId + "-" + categoryOptionComboId
  constructor(private modalCtrl: ModalController) {
    this.labelMapper = {};
    this.maxOptionCountAsRadion = 5;
  }

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    this.fieldId = fieldId;
    if (this.data && this.data[fieldId]) {
      this.inputFieldValue = this.data[fieldId].value;
    }
    if (this.options) {
      this.options.map((option: any) => {
        this.labelMapper[option.code] = option.name;
      });
    }
  }

  openOptionListModal() {
    let options: ModalOptions = {
      cssClass: 'inset-modal',
      enableBackdropDismiss: true
    };
    let data = {
      options: this.options,
      currentValue: this.inputFieldValue,
      title: this.optionListTitle ? this.optionListTitle : 'Options selections'
    };
    const modal = this.modalCtrl.create(
      'OptionListModalPage',
      { data: data },
      options
    );
    modal.onDidDismiss((selectedOption: any) => {
      if (selectedOption && selectedOption.id) {
        this.inputFieldValue = selectedOption.code;
        this.updateValues(this.inputFieldValue);
      }
    });
    modal.present();
  }

  updateValues(value) {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    this.onChange.emit({
      id: fieldId,
      value: value,
      status: 'not-synced'
    });
  }
}
