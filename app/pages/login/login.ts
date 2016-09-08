import { Component } from '@angular/core';
import { NavController ,ToastController } from 'ionic-angular';


import { TabsPage } from '../tabs/tabs';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';


/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [App,HttpClient,User]
})
export class LoginPage {

  private loginData : any ={};

  constructor(private navCtrl: NavController,private user: User,private app : App,private httpClient: HttpClient,private toastCtrl: ToastController) {
    this.loginData.logoUrl = 'img/logo.png';
    this.reAuthenticateUser();
  }

  reAuthenticateUser(){
    this.user.getCurrentUser().then(user=>{
      user = JSON.parse(user);
      if(user.isLogin){
        this.navCtrl.setRoot(TabsPage);
      }else if(user.serverUrl){
        this.loginData.serverUrl = user.serverUrl;
      }
    });
  }

  login(){
    if(this.loginData.serverUrl){
      this.app.getFormattedBaseUrl(this.loginData.serverUrl)
        .then(formattedBaseUrl => {
          this.loginData.serverUrl = formattedBaseUrl;
          if(!this.loginData.username){
            this.setToasterMessage('Please Enter username');
          }else if (!this.loginData.password){
            this.setToasterMessage('Please Enter password');
          }else{
            this.app.getDataBaseName(this.loginData.serverUrl).then(databaseName=>{
              this.user.setCurrentUser(this.loginData).then(user=>{
                let fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
                this.httpClient.get('/api/me.json?'+fields,user).subscribe(
                  data => {
                    this.setStickToasterMessage('success to login ');
                    this.user.setUserData(data).then(userData=>{
                      this.loginData.isLogin = true;
                      this.user.setCurrentUser(this.loginData).then(user=>{
                        this.navCtrl.setRoot(TabsPage);
                      });
                    });
                  },
                  err => {
                    this.setStickToasterMessage('Fail to login Fail to load System information, please checking your network connection');
                    console.log(err);
                  }
                );
              }).catch(err=>{
                console.log(err);
                this.setStickToasterMessage('Fail set current user');
              })
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

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }
}
