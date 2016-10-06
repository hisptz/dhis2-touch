import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {SettingsPage} from '../settings/settings';
import {ProfilePage} from '../profile/profile';
import {HelpPage} from '../help/help';
import {AboutPage} from '../about/about';
import {UpdateManagerPage} from '../update-manager/update-manager';
import { User } from '../../providers/user/user';

/*
  Generated class for the AccountPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/account/account.html',
  providers: [User]
})
export class AccountPage {

  private viewMapperObject : any;
  private currentUser : any;


  constructor(private navCtrl: NavController,private user : User) {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
    });
    this.generateViewAction();
  }

  generateViewAction(){
    this.viewMapperObject = {
      "profile" : ProfilePage,
      "about" : AboutPage,
      "help" : HelpPage,
      "settings" : SettingsPage,
      "updateManager" : UpdateManagerPage
    }
  }

  goToView(viewName){
    this.navCtrl.push(this.viewMapperObject[viewName]);
  }

  logOut(){
    alert(JSON.stringify(this.currentUser));
    alert(this.currentUser.isLogin)
  }

}
