import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the EventCoordinateSelectorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'event-coordinate-selector',
  templateUrl: 'event-coordinate-selector.html'
})
export class EventCoordinateSelectorComponent implements OnInit {
  isLoading: boolean;

  position: { lat: string; lng: string } = { lat: '', lng: '' };
  @Input() coordinate;
  @Output() onChangeEventCoordonate = new EventEmitter();

  constructor(private modalCtrl: ModalController) {
    this.isLoading = true;
  }

  @Output() onChange = new EventEmitter();

  ngOnInit() {
    if (this.coordinate) {
      const { latitude } = this.coordinate;
      const { longitude } = this.coordinate;
      if (latitude !== '0') {
        this.position.lng = longitude;
      }
      if (longitude !== '0') {
        this.position.lat = latitude;
      }
    } else {
      this.position = { lat: '', lng: '' };
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 50);
  }

  clearValue() {
    this.position = { lat: '', lng: '' };
    const dataValue = '';
    this.updateValue(dataValue);
  }

  openMap() {
    const data = {
      position: this.position
    };
    const modal = this.modalCtrl.create('CoordinateModalPage', { data: data });
    modal.onDidDismiss((response: any) => {
      if (response && response.lat && response.lng) {
        this.position.lat = response.lat.toFixed(6);
        this.position.lng = response.lng.toFixed(6);
        const dataValue =
          '[' + this.position.lat + ',' + this.position.lng + ']';
        this.updateValue(dataValue);
      }
    });
    modal.present();
  }

  updateValue(value) {
    let coordinate = { latitude: '', longitude: '' };
    if (value && value != '') {
      try {
        value = JSON.parse(value);
        if (value.length > 1) {
          coordinate.latitude = '' + value[0];
          coordinate.longitude = '' + value[1];
        }
      } catch (e) {
        coordinate.latitude = '0';
        coordinate.longitude = '0';
      }
    } else {
      coordinate.latitude = '0';
      coordinate.longitude = '0';
    }
    this.onChangeEventCoordonate.emit(coordinate);
  }
}
