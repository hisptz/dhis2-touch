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
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'app-coordinate',
  templateUrl: './coordinate.component.html',
  styleUrls: ['./coordinate.component.scss']
})
export class CoordinateComponent implements OnInit, OnDestroy, OnChanges {
  @Input() position: any;
  @Input() positionBasedOnPhone: any;
  @Input() altitude: string;
  @Input() accuracy: string;
  @Input() isLocationBasedOnPhone: boolean;
  @Input() isLoadingMyLocation: boolean;

  map: L.Map;
  center: L.PointTuple;
  marker: any;

  @Output() coordonateChange = new EventEmitter();

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 50);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes.positionBasedOnPhone &&
      !changes.positionBasedOnPhone.isFirstChange()
    ) {
      this.updateCurrentMarkLocation(this.position);
    }
  }

  initMap() {
    const defaultPosition = { lat: 0, lng: 0 };
    this.position = this.position || defaultPosition;
    const center = [this.position.lat, this.position.lng];
    try {
      this.map = L.map('coordinate-selection', {
        center,
        zoom: 5,
        zoomControl: false
      });
      this.map.addControl(L.control.zoom({ position: 'topright' }));
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.setMapMarker(center);
      this.setMapMarkerEvents();
    } catch (error) {}
  }

  setMapMarker(center: string[] | number[]) {
    this.marker = L.marker(center, {
      icon: L.icon({
        iconUrl: 'assets/icon/marker-icon.png',
        iconSize: [21, 31],
        iconAnchor: [10, 31],
        popupAnchor: [0, -31]
      })
    }).addTo(this.map);
    this.marker.dragging.enable();
  }

  setMapMarkerEvents() {
    this.marker.on('moveend', (event: any) => {
      this.isLoadingMyLocation = false;
      this.isLocationBasedOnPhone = false;
      this.updateCoordinateData();
    });
    this.marker.on('dragstart', (event: any) => {
      this.isLoadingMyLocation = false;
      this.isLocationBasedOnPhone = false;
      this.updateCoordinateData();
    });
    this.marker.on('movestart', (event: any) => {
      this.isLoadingMyLocation = false;
      this.isLocationBasedOnPhone = false;
      this.updateCoordinateData();
    });
    this.marker.on('dragend', (event: any) => {
      this.accuracy = '';
      this.altitude = '';
      const newMarker = event.target;
      const position = newMarker.getLatLng();
      this.updateCoordinateData(position);
    });
  }

  updateCoordinateData(position?: any) {
    let coordinateData: any = {
      accuracy: this.accuracy,
      altitude: this.altitude,
      isLocationBasedOnPhone: this.isLocationBasedOnPhone,
      isLoadingMyLocation: this.isLoadingMyLocation
    };
    if (position) {
      this.marker.setLatLng(new L.LatLng(position.lat, position.lng));
      coordinateData = {
        ...coordinateData,
        position: { lat: position.lat.toFixed(6), lng: position.lng.toFixed(6) }
      };
    }
    this.coordonateChange.emit(coordinateData);
  }

  updateCurrentMarkLocation(position: any) {
    if (position && position.lat && position.lng) {
      this.marker.setLatLng(new L.LatLng(position.lat, position.lng));
      this.map.setView(new L.LatLng(position.lat, position.lng), 8, {
        animation: true
      });
    }
  }

  ngOnDestroy() {
    this.map = null;
    this.center = null;
    this.marker = null;
    this.accuracy = null;
    this.altitude = null;
    this.isLocationBasedOnPhone = null;
    this.isLoadingMyLocation = null;
  }
}
