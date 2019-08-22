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
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class ToasterMessagesService {
  constructor(private toastController: ToastController) {}

  async showToasterMessage(
    message: string,
    duration: number = 4000,
    header?: string,
    position?: any
  ) {
    position = position ? position : 'bottom';
    message = this.getSanitizedErrorMessage(message);
    // @todo translate header and message
    const toasterConfig: ToastOptions = {
      ...{},
      message,
      header,
      position,
      duration
    };
    if (!header) {
      delete toasterConfig.header;
    }
    const toaster = await this.toastController.create(toasterConfig);
    toaster.present();
  }

  getSanitizedErrorMessage(message) {
    const { error } = message;
    const { status } = message;
    let customMessage = error
      ? error
      : typeof message === 'object'
      ? this.getKeyValuePairMessage(message)
      : message;
    try {
      const matchRegx = /<body[^>]*>([\w|\W]*)<\/body/im;
      customMessage = customMessage
        .match(matchRegx)[0]
        .replace(/(<([^>]+)>)/gi, ':separator:')
        .split(':separator:')
        .filter(content => content.length > 0)[0];
    } catch (e) {}
    if (status) {
      customMessage = `Status ${status}, ${customMessage}`;
    }
    return customMessage;
  }

  getKeyValuePairMessage(errorObject) {
    let keyValueMessage = '';
    Object.keys(errorObject).map(key => {
      let value = errorObject[key];
      if (typeof errorObject[key] === 'object') {
        value = this.getKeyValuePairMessage(errorObject[key]);
      }
      keyValueMessage = `${keyValueMessage} ${key} : ${value} `;
    });
    return keyValueMessage;
  }
}
