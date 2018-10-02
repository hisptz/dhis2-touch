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
 */
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { AppProvider } from '../app/app';

/*
  Generated class for the NetworkAvailabilityProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NetworkAvailabilityProvider {
  constructor(public AppProvider: AppProvider, public network: Network) {}

  getNetWorkStatus() {
    return {
      isAvailable:
        this.network.type == 'unknown' || this.network.type == 'none'
          ? false
          : true,
      message:
        this.network.type == 'unknown' || this.network.type == 'none'
          ? 'You are offline'
          : 'You are online',
      networkType: this.network.type
    };
  }

  setNetworkStatusDetection() {
    this.network.onConnect().subscribe(
      data => {
        this.displayNetworkUpdate(data.type);
      },
      error => console.error(error)
    );

    this.network.onDisconnect().subscribe(
      data => {
        this.displayNetworkUpdate(data.type);
      },
      error => console.error(error)
    );
  }

  displayNetworkUpdate(connectionState: string) {
    let message = `you are ${connectionState}`;
    this.AppProvider.setTopNotification(message);
  }
}
