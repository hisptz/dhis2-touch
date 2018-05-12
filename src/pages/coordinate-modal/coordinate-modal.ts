import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

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
  constructor(private navParams: NavParams, private viewCtrl: ViewController) {}
  ngOnInit() {
    const data = this.navParams.get('data');
    const { position } = data;
    if (
      position &&
      position.lng &&
      position.lat &&
      position.lat != '' &&
      position.lng != ''
    ) {
      this.position = position;
    }
  }

  saveCoordinate(position) {
    this.position = position;
    this.viewCtrl.dismiss(position);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
