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
import { Geolocation } from '@ionic-native/geolocation';
import { AppProvider } from '../../../../providers/app/app';

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
  @Input() position;
  @Output() onSavingCoordinate = new EventEmitter();
  @Output() onDismissView = new EventEmitter();

  constructor(
    private geolocation: Geolocation,
    private appProvider: AppProvider
  ) {}

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
    this.marker.on('dragend', event => {
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
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        const latitude = resp.coords.latitude;
        const longitude = resp.coords.longitude;
        this.marker.setLatLng(new L.LatLng(latitude, longitude));
        this.map.setView(latitude, longitude);
        this.position = { lat: latitude, lng: longitude };
      })
      .catch(error => {
        this.appProvider.setNormalNotification(
          'Error : ' + JSON.stringify(error)
        );
      });
  }
  savingLoaction() {
    this.onSavingCoordinate.emit(this.position);
  }
}
