import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SettingDetail} from "../setting-detail/setting-detail";

/*
  Generated class for the SettingHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting-home',
  templateUrl: 'setting-home.html',
  providers : []
})
export class SettingHome {

  constructor(public navCtrl : NavController) {
  }

  ionViewDidLoad() {

  }

  getSettingView(settingKey){
    //SettingDetail
    if(settingKey !=""){
      this.navCtrl.push(SettingDetail,{settingKey : settingKey});
    }
  }


}
