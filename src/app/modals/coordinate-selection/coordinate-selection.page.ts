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
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, getCurrentUserColorSettings } from '../../store';
import { AppColorObject } from 'src/models';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';

@Component({
  selector: 'app-coordinate-selection',
  templateUrl: './coordinate-selection.page.html',
  styleUrls: ['./coordinate-selection.page.scss']
})
export class CoordinateSelectionPage implements OnInit {
  cancelIcon: string;
  colorSettings$: Observable<AppColorObject>;
  position: any;
  positionBasedOnPhone: any;
  altitude: string;
  accuracy: string;
  isLocationBasedOnPhone: boolean;
  isLoadingMyLocation: boolean;

  constructor(
    private modalController: ModalController,
    private geolocationService: GeolocationService,
    private toasterMessagesService: ToasterMessagesService,
    private navParms: NavParams,
    private store: Store<State>
  ) {
    this.colorSettings$ = this.store.select(getCurrentUserColorSettings);
    this.cancelIcon = 'assets/icon/cancel.png';
    this.altitude = '';
    this.accuracy = '';
    this.isLoadingMyLocation = false;
    this.isLocationBasedOnPhone = false;
  }

  ngOnInit() {
    this.position = this.navParms.get('position');
    this.positionBasedOnPhone = this.position;
  }

  async closeModal(data?: any) {
    await this.modalController.dismiss(data);
  }

  onChangeCoordinate(data: any) {
    const {
      position,
      isLoadingMyLocation,
      isLocationBasedOnPhone,
      altitude,
      accuracy
    } = data;
    this.position = position || this.position;
    this.accuracy = accuracy;
    this.altitude = altitude;
    setTimeout(() => {
      this.isLoadingMyLocation = isLoadingMyLocation;
      this.isLocationBasedOnPhone = isLocationBasedOnPhone;
    }, 50);
  }

  async getMyCurrentLocation() {
    this.toasterMessagesService.showToasterMessage(
      'Discovering current location',
      2000,
      null,
      'top'
    );
    this.isLoadingMyLocation = true;
    try {
      const isLocationEnabled = await this.geolocationService.isLocationEnabled();
      if (isLocationEnabled) {
        const isLocationAuthorized = await this.geolocationService.isLocationAuthorized();
        if (isLocationAuthorized) {
          this.discoveringAndSetLocation();
        } else {
          const requestStatus = await this.geolocationService.requestPermision();
          if (requestStatus === 'RESTRICTED') {
            this.setErrorMessage(
              'Location services has been restricted on this phone'
            );
          } else if (requestStatus === 'DENIED_ALWAYS') {
            this.setErrorMessage(
              'Please enable location service manually on the app permissions settings page'
            );
          } else if (requestStatus === 'DENIED') {
            this.setErrorMessage('You have denied access yo your location');
          } else {
            this.discoveringAndSetLocation();
          }
        }
      } else {
        this.isLoadingMyLocation = false;
        this.setErrorMessage('Please switch on Location Services ');
      }
    } catch (error) {
      this.setErrorMessage('Error : ' + JSON.stringify(error));
    }
  }

  async discoveringAndSetLocation() {
    try {
      const geoLocationData: any = await this.geolocationService.getMyCurrentLocation();
      const { latitude, longitude, accuracy, altitude } = geoLocationData;
      this.accuracy = `${accuracy.toFixed(2)} meter(s)`;
      this.altitude = `${altitude.toFixed(2)} meter(s)`;
      this.position = { lat: latitude.toFixed(6), lng: longitude.toFixed(6) };
      this.positionBasedOnPhone = this.position;
      this.isLocationBasedOnPhone = true;
      this.toasterMessagesService.showToasterMessage(
        'Current location has been discovered',
        2000,
        null,
        'top'
      );
    } catch (error) {
      this.setErrorMessage('Error : ' + JSON.stringify(error));
    }
  }

  setErrorMessage(message: string) {
    this.isLoadingMyLocation = false;
    this.toasterMessagesService.showToasterMessage(message);
  }

  async saveCoordinate() {
    this.closeModal(this.position);
  }
}
