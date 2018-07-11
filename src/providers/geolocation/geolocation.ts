import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the GeolocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeolocationProvider {
  constructor(
    private geolocation: Geolocation,
    private diagnostic: Diagnostic
  ) {}

  isLocationAuthorized(): Observable<any> {
    return new Observable(observer => {
      this.diagnostic
        .getLocationAuthorizationStatus()
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

  requestPermision(): Observable<any> {
    return new Observable(observer => {
      this.diagnostic
        .requestLocationAuthorization()
        .then(
          status => {
            observer.next(status);
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

  isLocationEnabled(): Observable<any> {
    return new Observable(observer => {
      this.diagnostic
        .isLocationEnabled()
        .then(
          status => {
            observer.next(status);
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

  getMyLocation(): Observable<any> {
    return new Observable(observer => {
      const options: GeolocationOptions = {
        timeout: 4000,
        enableHighAccuracy: true,
        maximumAge: 4000
      };
      this.geolocation
        .getCurrentPosition(options)
        .then(resp => {
          const latitude = resp.coords.latitude;
          const longitude = resp.coords.longitude;
          const accuracy = resp.coords.accuracy;
          const altitude = resp.coords.altitude;
          const data = {
            latitude: latitude,
            longitude: longitude,
            altitude: altitude,
            accuracy: accuracy
          };
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
