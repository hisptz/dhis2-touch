import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import {Setting} from "../../providers/setting";

/*
  Generated class for the SettingDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting-detail',
  templateUrl: 'setting-detail.html',
  providers : [Setting]
})
export class SettingDetail {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public settingKey : string;

  constructor(private navCtrl : NavController,private Setting : Setting,private params:NavParams, private toastCtrl:ToastController) {
    this.settingKey = this.params.get('settingKey');
  }

  saveSetting(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
