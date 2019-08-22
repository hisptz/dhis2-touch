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
import { ToasterMessagesService } from 'src/app/services/toaster-messages.service';
import { BarcodeReaderService } from 'src/app/services/barcode-reader.service';
import { BarcodeSetting } from 'src/models';

@Component({
  selector: 'app-barcode-input',
  templateUrl: './barcode-input.component.html',
  styleUrls: ['./barcode-input.component.scss']
})
export class BarcodeInputComponent implements OnInit {
  @Input() barcodeSettings: BarcodeSetting;
  @Input() lockingFieldStatus: boolean;

  @Output() barcodeReaderChange = new EventEmitter();

  icon: string;

  constructor(
    private toasterMessage: ToasterMessagesService,
    private barcodeReader: BarcodeReaderService
  ) {
    this.icon = 'assets/icon/barcode-reader.png';
  }

  ngOnInit() {}
  intiateBarcodeOrQRcode() {
    if (!this.lockingFieldStatus) {
      this.barcodeReader.isCameraAvailable().subscribe(
        isCameraAvailable => {
          if (isCameraAvailable) {
            this.barcodeReader.isCameraAuthorized().subscribe(
              isCameraAuthorized => {
                if (isCameraAuthorized) {
                  this.scanBarcodeOrQrcode();
                } else {
                  this.barcodeReader.requestCameraAuthorization().subscribe(
                    requestStatus => {
                      if (requestStatus === 'RESTRICTED') {
                        this.toasterMessage.showToasterMessage(
                          'Camera services has been restricted on this phone'
                        );
                      } else if (requestStatus === 'DENIED_ALWAYS') {
                        this.toasterMessage.showToasterMessage(
                          'Please enable camera manually on the app permissions settings page'
                        );
                      } else if (requestStatus === 'DENIED') {
                        this.toasterMessage.showToasterMessage(
                          'You have denied usage of camera, this feature can not be available'
                        );
                      } else {
                        this.scanBarcodeOrQrcode();
                      }
                    },
                    error => {
                      this.toasterMessage.showToasterMessage(
                        'Error on request camera permission ' +
                          JSON.stringify(error)
                      );
                    }
                  );
                }
              },
              error => {
                this.toasterMessage.showToasterMessage(
                  'Error on getting camera authorization status ' +
                    JSON.stringify(error)
                );
              }
            );
          } else {
            this.toasterMessage.showToasterMessage(
              'Camera is not available for scanning'
            );
          }
        },
        error => {
          this.toasterMessage.showToasterMessage(
            'Error on getting camera availability status ' +
              JSON.stringify(error)
          );
        }
      );
    }
  }

  scanBarcodeOrQrcode() {
    this.barcodeReader.scanBarcodeOrQrCode(this.barcodeSettings).subscribe(
      dataResponse => {
        this.barcodeReaderChange.emit(dataResponse);
      },
      error => {
        this.toasterMessage.showToasterMessage(
          'Error on scanning ' + JSON.stringify(error)
        );
      }
    );
  }
}
