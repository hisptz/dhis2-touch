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
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the CoordinateInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'coordinate-input',
  templateUrl: 'coordinate-input.html'
})
export class CoordinateInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();
  position: { lat: string; lng: string } = { lat: '', lng: '' };
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    console.log(JSON.stringify(this.data));
    if (this.data && this.data[fieldId]) {
      const dataValue = eval(this.data[fieldId].value);
      if (dataValue && dataValue.length === 2) {
        this.position.lng = dataValue[1];
        this.position.lat = dataValue[0];
      } else {
        this.position = { lat: '', lng: '' };
      }
    }
  }

  clearValue() {
    this.position = { lat: '', lng: '' };
    const dataValue = '';
    this.updateValue(dataValue);
  }

  openMap() {
    const data = {
      position: this.position
    };
    const modal = this.modalCtrl.create('CoordinateModalPage', { data: data });
    modal.onDidDismiss((response: any) => {
      if (response && response.lat && response.lng) {
        this.position.lat = response.lat.toFixed(6);
        this.position.lng = response.lng.toFixed(6);
        const dataValue =
          '[' + this.position.lat + ',' + this.position.lng + ']';
        this.updateValue(dataValue);
      }
    });
    modal.present();
  }

  updateValue(dataValue: string) {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    this.onChange.emit({
      id: fieldId,
      value: dataValue,
      status: 'not-synced'
    });
  }
}
