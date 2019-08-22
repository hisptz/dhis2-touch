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
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarcodeReaderService {
  constructor(
    private diagnostic: Diagnostic,
    private barcodeScanner: BarcodeScanner
  ) {}

  isCameraAvailable(): Observable<any> {
    let status = false;
    return new Observable(observer => {
      this.diagnostic
        .isCameraPresent()
        .then(() => {
          status = true;
          observer.next(status);
          observer.complete();
        })
        .catch(() => {
          observer.next(status);
          observer.complete();
        });
    });
  }

  isCameraAuthorized(): Observable<any> {
    return new Observable(observer => {
      this.diagnostic
        .getCameraAuthorizationStatus()
        .then(status => {
          if (status === 'GRANTED') {
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  requestCameraAuthorization(): Observable<any> {
    return new Observable(observer => {
      this.diagnostic
        .requestCameraAuthorization(false)
        .then(status => {
          observer.next(status);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  scanBarcodeOrQrCode(barcodeSettings): Observable<any> {
    return new Observable(observer => {
      this.barcodeScanner
        .scan()
        .then((barcodeData: any) => {
          const { text } = barcodeData;
          const { cancelled } = barcodeData;
          const dataResponse = this.getSanitizedData(
            text,
            cancelled,
            barcodeSettings
          );
          observer.next(dataResponse);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  getSanitizedData(scanedText, cancelled, barcodeSettings?) {
    let isMultlined = false;
    let isMultidata = false;
    let data;
    if (!scanedText || cancelled) {
      data = '';
    } else {
      data = scanedText;
      if (barcodeSettings) {
        const { activateMultiline } = barcodeSettings;
        const { multilineSeparator } = barcodeSettings;
        const { keyPairSeparator } = barcodeSettings;
        if (activateMultiline) {
          if (scanedText.indexOf(multilineSeparator) === -1) {
            data = scanedText;
          } else if (
            scanedText.indexOf(keyPairSeparator) === -1 &&
            scanedText.indexOf(multilineSeparator) > -1
          ) {
            data = scanedText;
            isMultlined = true;
          } else if (
            scanedText.indexOf(keyPairSeparator) > -1 &&
            scanedText.indexOf(multilineSeparator) > -1
          ) {
            data = [];
            scanedText.split(multilineSeparator).map(keyValuePair => {
              const keyValuePairArray = keyValuePair.split(keyPairSeparator);
              if (keyValuePairArray.length > 1) {
                const object = {};
                object[keyValuePairArray[0]] = keyValuePairArray[1];
                data.push(object);
              }
            });
            isMultlined = true;
            isMultidata = true;
          }
        }
      }
    }
    return { isMultlined: isMultlined, isMultidata: isMultidata, data: data };
  }
}
