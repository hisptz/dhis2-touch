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

import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(
    private geolocation: Geolocation,
    private diagnostic: Diagnostic
  ) {}

  isLocationAuthorized() {
    let locationStatus = false;
    return new Promise((resolve, reject) => {
      this.diagnostic
        .getLocationAuthorizationStatus()
        .then(status => {
          locationStatus = status === 'GRANTED' ? true : false;
          resolve(locationStatus);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  async requestPermision() {
    return this.diagnostic.requestLocationAuthorization();
  }

  isLocationEnabled() {
    let isLocationEnabled = false;
    return new Promise((resolve, reject) => {
      this.diagnostic
        .isLocationEnabled()
        .then((status: any) => {
          isLocationEnabled = status;
          resolve(isLocationEnabled);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getMyCurrentLocation() {
    const options: GeolocationOptions = {
      timeout: 4000,
      enableHighAccuracy: true,
      maximumAge: 4000
    };
    return new Promise((resolve, reject) => {
      this.geolocation
        .getCurrentPosition(options)
        .then((response: any) => {
          const latitude = response.coords.latitude;
          const longitude = response.coords.longitude;
          const accuracy = response.coords.accuracy;
          const altitude = response.coords.altitude;
          resolve({ latitude, longitude, accuracy, altitude });
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}
