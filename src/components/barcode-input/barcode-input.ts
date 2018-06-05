import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { BarcodeReaderProvider } from '../../providers/barcode-reader/barcode-reader';
import { AppProvider } from '../../providers/app/app';

/**
 * Generated class for the BarcodeInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'barcode-input',
  templateUrl: 'barcode-input.html'
})
export class BarcodeInputComponent implements OnInit, OnDestroy {
  @Output() barcodeReaderChange = new EventEmitter();
  icon: string;

  constructor(
    private barcodeReaderProvider: BarcodeReaderProvider,
    private appProvider: AppProvider
  ) {
    this.icon = 'assets/icon/barcode-reader.png';
  }

  ngOnInit() {}

  intiateBarcodeOrQRcode() {
    this.barcodeReaderProvider.isCameraAvailable().subscribe(
      isCameraAvailable => {
        if (isCameraAvailable) {
          this.barcodeReaderProvider.isCameraAuthorized().subscribe(
            isCameraAuthorized => {
              if (isCameraAuthorized) {
                this.scanBarcodeOrQrcode();
              } else {
                this.barcodeReaderProvider
                  .requestCameraAuthorization()
                  .subscribe(
                    requestStatus => {
                      if (requestStatus === 'RESTRICTED') {
                        this.appProvider.setNormalNotification(
                          'Camera services has been restricted on this phone'
                        );
                      } else if (requestStatus === 'DENIED_ALWAYS') {
                        this.appProvider.setNormalNotification(
                          'Please enable camera manually on the app permissions settings page'
                        );
                      } else if (requestStatus === 'DENIED') {
                        this.appProvider.setNormalNotification(
                          'You have denied usage of camera, this feature can not be available'
                        );
                      } else {
                        this.scanBarcodeOrQrcode();
                      }
                    },
                    error => {
                      this.appProvider.setNormalNotification(
                        'Error on request camera permission ' +
                          JSON.stringify(error)
                      );
                    }
                  );
              }
            },
            error => {
              this.appProvider.setNormalNotification(
                'Error on getting camera authorization status ' +
                  JSON.stringify(error)
              );
            }
          );
        } else {
          this.appProvider.setNormalNotification(
            'Camera is not available for scan'
          );
        }
      },
      error => {
        this.appProvider.setNormalNotification(
          'Error on getting camera availability status ' + JSON.stringify(error)
        );
      }
    );
  }

  scanBarcodeOrQrcode() {
    this.barcodeReaderProvider.scanBarcodeOrQrCode().subscribe(
      dataResponse => {
        this.barcodeReaderChange.emit(dataResponse);
      },
      error => {
        this.appProvider.setNormalNotification(
          'Error on scanning ' + JSON.stringify(error)
        );
      }
    );
  }

  ngOnDestroy() {}
}
