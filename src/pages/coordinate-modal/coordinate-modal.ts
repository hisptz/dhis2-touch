import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

/**
 * Generated class for the CoordinateModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coordinate-modal',
  templateUrl: 'coordinate-modal.html'
})
export class CoordinateModalPage implements OnInit {
  position: any;
  isLoading: boolean;
  constructor(private navParams: NavParams) {
    this.isLoading = true;
  }

  //logics for preparing data
  ngOnInit() {
    this.isLoading = false;
  }

  changeCoordinate(position) {
    this.position = position;
  }
}
