import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the DashBoardHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dash-board-home',
  templateUrl: 'dash-board-home.html'
})
export class DashBoardHome {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello DashBoardHome Page');
  }

}
