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

  getMyLocation(): Observable<any> {
    return new Observable(observer => {
      const options: GeolocationOptions = {
        timeout: 4000,
        enableHighAccuracy: true
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
