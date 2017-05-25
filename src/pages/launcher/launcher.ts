import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {User} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";
import {LoginPage} from "../login/login";
import {Synchronization} from "../../providers/synchronization";
import {AppPermission} from "../../providers/app-permission";

/*
  Generated class for the Launcher page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var cordova;

@Component({
  selector: 'page-launcher',
  templateUrl: 'launcher.html'
})
export class LauncherPage implements OnInit{

  public logoUrl : string = "";

  constructor(public navCtrl: NavController,
              public AppPermission : AppPermission,
              public synchronization:Synchronization,
              public user : User) {}

  ngOnInit() {
    this.logoUrl = 'assets/img/logo-2.png';
    this.AppPermission.checkAndRequestAppPermission();
    this.user.getCurrentUser().then((user : any)=>{
      if(user && user.isLogin){
        this.synchronization.startSynchronization().then(()=>{
        });
        this.navCtrl.setRoot(TabsPage);
      }else{
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }



}
