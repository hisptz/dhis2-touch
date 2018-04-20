import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';

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
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
}
