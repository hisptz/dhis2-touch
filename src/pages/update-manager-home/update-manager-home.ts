import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the UpdateManagerHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-update-manager-home',
  templateUrl: 'update-manager-home.html'
})
export class UpdateManagerHome {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello UpdateManagerHome Page');
  }

}
