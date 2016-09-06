import { Component } from '@angular/core';
import { NavController ,ToastController,Storage, LocalStorage } from 'ionic-angular';


import { TabsPage } from '../tabs/tabs';


import { App } from '../../providers/app/app';
//import {HttpClient} from '../../providers/http-client/http-client';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [App]
})
export class LoginPage {

  private loginData : any ={};
  private localStorage: any;

  constructor(private navCtrl: NavController,private app : App,private toastCtrl: ToastController) {
    this.loginData.logoUrl = 'img/logo.png';
    this.localStorage = new Storage(LocalStorage);
  }

  login(){
    if(this.loginData.serveUrl){
      this.app.getFormattedBaseUrl(this.loginData.serveUrl)
        .then(formattedBaseUrl => {
          this.loginData.serveUrl = formattedBaseUrl;
          if(!this.loginData.username){
            this.setToasterMessage('Please Enter username');
          }else if (!this.loginData.password){
            this.setToasterMessage('Please Enter password');
          }else{
            this.app.getDataBaseName(this.loginData.serveUrl).then(databaseName=>{
              console.log(databaseName);
              console.log(this.loginData);
              var user :any = {
                username: this.loginData.username,
                password: this.loginData.password,
                serverUrl : this.loginData.serveUrl
              };
              console.log(user);
              this.navCtrl.setRoot(TabsPage);
              this.localStorage.set('user',JSON.stringify(user));
              //this.httpClient.get('/me.json',user).subscribe(
              //  data => {
              //    console.log('success login');
              //    this.setToasterMessage('success to login ' + JSON.stringify(data));
              //    console.log(data);
              //  },
              //  err => {
              //    this.setToasterMessage('Fail to login ' + JSON.stringify(err));
              //    console.log('fail to login');
              //    console.log(err);
              //  }
              //);

            });

          }
        });
    }else{
      this.setToasterMessage('Please Enter server url');
    }

  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
