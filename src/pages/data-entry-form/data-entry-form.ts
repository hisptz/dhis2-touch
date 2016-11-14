import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';

/*
  Generated class for the DataEntryForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-entry-form',
  templateUrl: 'data-entry-form.html'
})
export class DataEntryForm {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public data : any;

  constructor(public params : NavParams,public toastCtrl: ToastController) {
    this.data = this.params.get('data');
  }

  ionViewDidLoad() {
    console.log('Hello DataEntryForm Page');
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
