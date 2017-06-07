import { Component,OnInit} from '@angular/core';
import { NavController,App } from 'ionic-angular';
import {User} from "../../providers/user";
import {UpdateManagerHomePage} from "../update-manager-home/update-manager-home";
import {SettingHomePage} from "../setting-home/setting-home";
import {AboutPage} from "../about/about";
import {ProfilePage} from "../profile/profile";
import {HelpPage} from "../help/help";
import {LoginPage} from "../login/login";
import {SqlLite} from "../../providers/sql-lite";

/*
  Generated class for the Account page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage implements OnInit{

  private viewMapperObject : any;
  private currentUser : any;

  constructor(public navCtrl: NavController,public app : App,private user : User,private SqlLite : SqlLite) {}

  ngOnInit() {
    this.viewMapperObject = {
      "profile" : ProfilePage,
      "about" : AboutPage,
      "help" : HelpPage,
      //"settings" : SettingHomePage,
      //"updateManager" : UpdateManagerHomePage
    };
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
    })
  }

  goToView(viewName){
    this.navCtrl.push(this.viewMapperObject[viewName]);
  }

  logOut(){
    this.currentUser.isLogin = false;
    this.user.setCurrentUser(this.currentUser).then(user=>{
      this.app.getRootNav().setRoot(LoginPage);
    },error=>{});
  }

}
