import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the SettingHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting-home',
  templateUrl: 'setting-home.html'
})
export class SettingHome {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello SettingHome Page');
  }

}
