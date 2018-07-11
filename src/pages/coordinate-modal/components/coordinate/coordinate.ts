import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import L from 'leaflet';
import { AppProvider } from '../../../../providers/app/app';
import { GeolocationProvider } from '../../../../providers/geolocation/geolocation';

/**
 * Generated class for the CoordinateComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'coordinate',
  templateUrl: 'coordinate.html'
})
export class CoordinateComponent implements OnInit {
  @ViewChild('map') mapContainer: ElementRef;
  map: L.Map;
  center: L.PointTuple;
  marker: any;
  accuracy: string;
  altitude: string;
  isLocationBasedOnPhone: boolean;
  isLoadingMyLocation: boolean;
  @Input() position;
  @Output() onSavingCoordinate = new EventEmitter();
  @Output() onDismissView = new EventEmitter();

  constructor(
    private geolocation: GeolocationProvider,
    private appProvider: AppProvider
  ) {
    this.accuracy = '';
    this.altitude = '';
    this.isLoadingMyLocation = false;
    this.isLocationBasedOnPhone = false;
  }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 200);
  }

  initMap() {
    const defaultPosition = { lat: 0, lng: 0 };
    let center = [defaultPosition.lat, defaultPosition.lng];
    if (this.position && this.position.lat && this.position.lng) {
      center = [this.position.lat, this.position.lng];
    } else {
      this.position = defaultPosition;
    }
    this.map = L.map('coordinate-selection', {
      center: center,
      zoom: 5,
      zoomControl: false
    });
    this.map.addControl(L.control.zoom({ position: 'topright' }));
    //Add OSM Layer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    //adding marker
    this.marker = L.marker(center, {
      icon: L.icon({
        iconUrl: 'assets/icon/marker-icon.png',
        iconSize: [21, 31], // size of the icon
        iconAnchor: [10, 31], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -31]
      })
    }).addTo(this.map);
    this.marker.dragging.enable();
    this.marker.on('moveend', event => {
      this.isLoadingMyLocation = false;
      this.isLocationBasedOnPhone = false;
    });
    this.marker.on('dragstart', event => {
      this.isLoadingMyLocation = false;
      this.isLocationBasedOnPhone = false;
    });
    this.marker.on('movestart', event => {
      this.isLoadingMyLocation = false;
      this.isLocationBasedOnPhone = false;
    });
    this.marker.on('dragend', event => {
      this.accuracy = '';
      this.altitude = '';
      const newMarker = event.target;
      const position = newMarker.getLatLng();
      this.position = position;
      this.marker.setLatLng(new L.LatLng(position.lat, position.lng));
    });
  }

  dismissView() {
    this.onDismissView.emit();
  }
  getMylocation() {
    this.isLoadingMyLocation = true;
    this.geolocation.isLocationEnabled().subscribe(
      enableStatus => {
        if (enableStatus) {
          this.geolocation.isLocationAuthorized().subscribe(
            authorizatioStatus => {
              if (authorizatioStatus) {
                this.geolocation.getMyLocation().subscribe(
                  data => {
                    this.setMyLocation(data);
                  },
                  error => {
                    this.isLoadingMyLocation = false;
                    this.appProvider.setNormalNotification(
                      'Error : ' + JSON.stringify(error)
                    );
                  }
                );
              } else {
                this.geolocation.requestPermision().subscribe(
                  requestStatus => {
                    if (requestStatus === 'RESTRICTED') {
                      this.appProvider.setNormalNotification(
                        'Location services has been restricted on this phone'
                      );
                    } else if (requestStatus === 'DENIED_ALWAYS') {
                      this.appProvider.setNormalNotification(
                        'Please enable location service manually on the app permissions settings page'
                      );
                    } else {
                      this.geolocation.getMyLocation().subscribe(
                        data => {
                          this.setMyLocation(data);
                        },
                        error => {
                          this.isLoadingMyLocation = false;
                          this.appProvider.setNormalNotification(
                            'Error : ' + JSON.stringify(error)
                          );
                        }
                      );
                    }
                  },
                  error => {
                    this.isLoadingMyLocation = false;
                    this.appProvider.setNormalNotification(
                      'Error : ' + JSON.stringify(error)
                    );
                  }
                );
              }
            },
            error => {
              this.isLoadingMyLocation = false;
              this.appProvider.setNormalNotification(
                'Error : ' + JSON.stringify(error)
              );
            }
          );
        } else {
          this.appProvider.setNormalNotification(
            'Please switch on Location Services '
          );
          this.isLoadingMyLocation = false;
        }
      },
      error => {
        this.isLoadingMyLocation = false;
        this.appProvider.setNormalNotification(
          'Error : ' + JSON.stringify(error)
        );
      }
    );
  }

  setMyLocation(data) {
    const latitude = data.latitude;
    const longitude = data.longitude;
    this.accuracy =
      (data.accuracy ? data.accuracy.toFixed(2) : ' ') + ' meter(s)';
    this.altitude =
      (data.altitude ? data.altitude.toFixed(2) : ' ') + ' meter(s)';
    this.marker.setLatLng(new L.LatLng(latitude, longitude));
    this.map.setView(new L.LatLng(latitude, longitude), 8, {
      animation: true
    });
    this.position = { lat: latitude, lng: longitude };
    this.isLoadingMyLocation = false;
    this.isLocationBasedOnPhone = true;
  }
  savingLoaction() {
    this.onSavingCoordinate.emit(this.position);
  }
}
