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
  constructor(private modalCtrl: ModalController) {
    this.position = { lat: '3.3', lng: '11.7' };
  }

  ngOnInit() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
  }

  openMap() {
    const modal = this.modalCtrl.create('CoordinateModalPage', {});
    modal.onDidDismiss((response: any) => {
      if (response && response.lat && response.lng) {
        this.position.lng = response.lng;
        this.position.lat = response.lat;
        console.log(JSON.stringify(response));
      }
    });
    modal.present();
  }

  updateValue() {
    const fieldId = this.dataElementId + '-' + this.categoryOptionComboId;
  }
}
