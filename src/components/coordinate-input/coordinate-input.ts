import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, ModalOptions } from 'ionic-angular';

/**
 * Generated class for the CoordinateInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'coordinate-input',
  templateUrl: 'coordinate-input.html'
})
export class CoordinateInputComponent implements OnInit {
  @Input() dataElementId;
  @Input() categoryOptionComboId;
  @Input() data;
  @Output() onChange = new EventEmitter();
  position: { lat: string; lng: string } = { lat: '', lng: '' };
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (this.data && this.data[fieldId]) {
      const dataValue = eval(this.data[fieldId].value);
      if (dataValue && dataValue.length === 2) {
        this.position.lng = dataValue[1];
        this.position.lat = dataValue[0];
      } else {
        this.position = { lat: '', lng: '' };
      }
    }
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

  updateValue(dataValue: string) {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
    if (
      this.data &&
      this.data[fieldId] &&
      dataValue != this.data[fieldId].value
    ) {
      this.onChange.emit({
        id: fieldId,
        value: dataValue,
        status: 'not-synced'
      });
    } else if (this.data && !this.data[fieldId]) {
      if (dataValue) {
        this.onChange.emit({
          id: fieldId,
          value: dataValue,
          status: 'not-synced'
        });
      }
    }
  }
}
