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
export class CoordinateComponent {
  @ViewChild('map') mapContainer: ElementRef;
  map: L.Map;
  center: L.PointTuple;
  marker: any;
  @Input() position;
  @Output() onCoordinateChange = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    //center based on location
    const defaultPosition = [3.3, 11.7];
    const center =
      this.position && this.position.lat && this.position.lng
        ? [this.position.lat, this.position.lng]
        : defaultPosition;
    this.map = L.map('map', {
      center: center,
      zoom: 5
    });
    //Add OSM Layer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    //adding marker
    const marker = L.marker(center, {
      icon: L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [21, 31], // size of the icon
        iconAnchor: [10, 31], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -31]
      })
    }).addTo(this.map);
    marker.dragging.enable();
    marker.on('dragend', event => {
      const newMarker = event.target;
      const position = newMarker.getLatLng();
      marker.setLatLng(new L.LatLng(position.lat, position.lng));
      this.onCoordinateChange.emit(position);
    });
  }
}
