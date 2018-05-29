import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the BarcodeReaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BarcodeReaderProvider {
  constructor(
    private diagnostic: Diagnostic,
    private barcodeScanner: BarcodeScanner
  ) {}

  isCameraAvailable(): Observable<any> {
    let status = false;
    return new Observable(observer => {
      this.diagnostic
        .isCameraPresent()
        .then(
          () => {
            status = true;
            observer.next(status);
            observer.complete();
          },
          error => {
            observer.next(status);
            observer.complete();
          }
        )
        .catch(error => {
          observer.next(status);
          observer.complete();
        });
    });
  }

  isCameraAuthorized(): Observable<any> {
    return new Observable(observer => {
      this.diagnostic
        .getCameraAuthorizationStatus()
        .then(
          status => {
            if (status === 'GRANTED') {
              observer.next(true);
            } else {
              observer.next(false);
            }
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        )
        .catch(error => {
          observer.error(error);
        });
    });
  }

  requestCameraAuthorization(): Observable<any> {
    return new Observable(observer => {
      this.diagnostic
        .requestCameraAuthorization(false)
        .then(
          status => {
            observer.next(status);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        )
        .catch(error => {
          observer.error(error);
        });
    });
  }

  scanBarcodeOrQrCode(): Observable<any> {
    return new Observable(observer => {
      this.barcodeScanner
        .scan()
        .then((barcodeData: any) => {
          const { text } = barcodeData;
          const dataResponse = this.getSanitizedData(text);
          observer.next(dataResponse);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // @todo revisit sanitizaation of possible values from scaned text
  getSanitizedData(scanedText) {
    let isMultlined = false;
    let isMultidata = false;
    let data;
    if (!scanedText) {
      data = '';
    } else {
      if (scanedText.indexOf('\n') == -1) {
        data = scanedText;
      } else if (
        scanedText.indexOf(':') == -1 &&
        scanedText.indexOf('\n') > -1
      ) {
        data = scanedText;
        isMultlined = true;
      } else if (
        scanedText.indexOf(':') > -1 &&
        scanedText.indexOf('\n') > -1
      ) {
        data = scanedText.split('\n');
        isMultlined = true;
        isMultidata = true;
      } else {
        data = scanedText;
      }
    }
    return { isMultlined: isMultlined, isMultidata: isMultidata, data: data };
  }
}
