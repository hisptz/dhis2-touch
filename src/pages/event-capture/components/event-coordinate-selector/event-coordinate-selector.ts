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
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../../../store';
import { Observable } from 'rxjs';

/**
 * Generated class for the EventCoordinateSelectorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'event-coordinate-selector',
  templateUrl: 'event-coordinate-selector.html'
})
export class EventCoordinateSelectorComponent implements OnInit {
  @Input() coordinate;
  @Output() onChangeEventCoordonate = new EventEmitter();

  isLoading: boolean;
  position: { lat: string; lng: string } = { lat: '', lng: '' };
  colorSettings$: Observable<any>;

  constructor(private store: Store<State>, private modalCtrl: ModalController) {
    this.isLoading = true;
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
  }

  @Output() onChange = new EventEmitter();

  ngOnInit() {
    if (this.coordinate) {
      const { latitude } = this.coordinate;
      const { longitude } = this.coordinate;
      if (latitude !== '0') {
        this.position.lng = longitude;
      }
      if (longitude !== '0') {
        this.position.lat = latitude;
      }
    } else {
      this.position = { lat: '', lng: '' };
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 50);
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

  updateValue(value) {
    let coordinate = { latitude: '', longitude: '' };
    if (value && value != '') {
      try {
        value = JSON.parse(value);
        if (value.length > 1) {
          coordinate.latitude = '' + value[0];
          coordinate.longitude = '' + value[1];
        }
      } catch (e) {
        coordinate.latitude = '0';
        coordinate.longitude = '0';
      }
    } else {
      coordinate.latitude = '0';
      coordinate.longitude = '0';
    }
    this.onChangeEventCoordonate.emit(coordinate);
  }
}
