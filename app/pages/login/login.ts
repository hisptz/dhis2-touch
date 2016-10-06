import { Component } from '@angular/core';
import { NavController ,ToastController } from 'ionic-angular';


import { TabsPage } from '../tabs/tabs';

import { AppProvider } from '../../providers/app-provider/app-provider';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";


/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [AppProvider,HttpClient,User,SqlLite]
})
export class LoginPage {

  private loginData : any ={};
  private loadingData : boolean = false;
  private loadingMessages : any = [];

  constructor(private navCtrl: NavController,private sqlLite : SqlLite,private user: User,private app : AppProvider,private httpClient: HttpClient,private toastCtrl: ToastController) {
    this.loginData.logoUrl = 'img/logo.png';
    this.user.getCurrentUser().then(user=>{
      this.reAuthenticateUser(user);
    });
  }

  reAuthenticateUser(user){
    if(user){
      if(user.isLogin){
        this.navCtrl.setRoot(TabsPage);
      }else if(user.serverUrl){
        this.loginData.serverUrl = user.serverUrl;
        if(user.username){
          this.loginData.username = user.username;
        }
      }
    }
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
            this.loadingData = true;
            this.loadingMessages = [];
            this.app.getDataBaseName(this.loginData.serverUrl).then(databaseName=>{
              this.setLoadingMessages('Opening database');
              this.sqlLite.generateTables(databaseName).then(()=>{
                this.loginData.currentDatabase = databaseName;
                this.setLoadingMessages('Authenticating user');
                this.user.setCurrentUser(this.loginData).then(user=>{
                  let fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
                  this.httpClient.get('/api/me.json?'+fields,user).subscribe(
                    data => {
                      data = data.json();
                      this.setStickToasterMessage('success to login ');
                      this.user.setUserData(data).then(userData=>{
                        this.loginData.isLogin = true;
                        this.user.setCurrentUser(this.loginData).then(user=>{
                          this.navCtrl.setRoot(TabsPage);
                        });
                      });
                    },
                    err => {
                      this.loadingData = false;
                      this.setStickToasterMessage('Fail to login Fail to load System information, please checking your network connection');
                      console.log(err);
                    }
                  );
                }).catch(err=>{
                  console.log(JSON.stringify(err));
                  this.loadingData = false;
                  this.setStickToasterMessage('Fail set current user');
                })
              },()=>{
                //error on create database
                this.loadingData = false;
                this.setStickToasterMessage('Fail to open local storage');
              });

            });
          }
        });
    }else{
      this.setToasterMessage('Please Enter server url');
    }
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
