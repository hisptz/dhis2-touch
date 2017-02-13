import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {HttpClient} from "../../providers/http-client/http-client";
import {AppProvider} from "../../providers/app-provider/app-provider";
import {TabsPage} from "../tabs/tabs";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import { Storage } from '@ionic/storage';
import {Synchronization} from "../../providers/synchronization";
import {DataValues} from "../../providers/data-values";
import {Setting} from "../../providers/setting";
import {NetworkAvailability} from "../../providers/network-availability";
import {Login} from "../login/login";

/*
  Generated class for the Launcher page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-launcher',
  templateUrl: 'launcher.html',
  providers : [AppProvider,HttpClient,User,SqlLite,Synchronization,DataValues,Setting,NetworkAvailability]
})
export class Launcher {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public logoUrl : string;

  constructor(public navCtrl: NavController,private Storage : Storage,
              private Setting: Setting,public NetworkAvailability : NetworkAvailability,
              private sqlLite : SqlLite,private synchronization:Synchronization,
              private DataValues: DataValues,
              private app : AppProvider,private httpClient : HttpClient,private user : User) {

    this.logoUrl = 'assets/img/logo-2.png';
    this.loadingData = false;
    this.loadingMessages = [];
    this.user.getCurrentUser().then(user=>{
      this.reAuthenticateUser(user);
    });
  }

  ionViewDidLoad() {

  }

  reAuthenticateUser(user){
    if(user && user.isLogin){
      this.navCtrl.setRoot(TabsPage);
      this.loadingData = false;
    }else{
      this.navCtrl.setRoot(Login);
      this.loadingData = false;
    }
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

}
