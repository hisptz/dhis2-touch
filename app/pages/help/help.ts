import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

/*
  Generated class for the HelpPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/help/help.html',
})
export class HelpPage {

  private loadingData : boolean = false;
  private loadingMessages : any = [];

  constructor(private navCtrl: NavController,private toastCtrl: ToastController) {

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

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }

}
