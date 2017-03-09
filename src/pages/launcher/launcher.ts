import { Component ,OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {TabsPage} from "../tabs/tabs";
import {Login} from "../login/login";

/*
  Generated class for the Launcher page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-launcher',
  templateUrl: 'launcher.html',
  providers : [User]
})
export class Launcher implements OnInit{

  public logoUrl : string = "";

  constructor(public navCtrl: NavController,public user : User) {
  }

  ngOnInit() {
    this.logoUrl = 'assets/img/logo-2.png';
    this.user.getCurrentUser().then(user=>{
      this.reAuthenticateUser(user);
    });
  }

  ionViewDidLoad() {}

  reAuthenticateUser(user){
    if(user && user.isLogin){
      this.navCtrl.setRoot(TabsPage);
    }else{
      this.navCtrl.setRoot(Login);
    }
  }


}
