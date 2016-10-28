import { Component } from '@angular/core';
import { NavController,App } from 'ionic-angular';
import {Profile} from "../profile/profile";
import {About} from "../about/about";
import {Help} from "../help/help";
import {UpdateManagerHome} from "../update-manager-home/update-manager-home";
import {Login} from "../login/login";
import {SettingHome} from "../setting-home/setting-home";
import {User} from "../../providers/user/user";

/*
  Generated class for the Account page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  providers : [User]
})
export class Account {

  private viewMapperObject : any;
  private currentUser : any;

  constructor(public navCtrl: NavController,public app : App,private user : User) {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
    });
    this.setViewAction();
  }

  ionViewDidLoad() {

  }

  setViewAction():void{
    this.viewMapperObject = {
      "profile" : Profile,
      "about" : About,
      "help" : Help,
      "settings" : SettingHome,
      "updateManager" : UpdateManagerHome
    }
  }

  goToView(viewName){
    this.navCtrl.push(this.viewMapperObject[viewName]);
  }

  logOut(){
    //@todo delete all assign org unit form database
    this.currentUser.isLogin = false;
    this.user.setCurrentUser(this.currentUser).then(user=>{
      this.app.getRootNav().setRoot(Login);
    },error=>{});
  }

}
