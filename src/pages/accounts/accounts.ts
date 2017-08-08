import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController ,App} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";

/**
 * Generated class for the AccountsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage implements OnInit{

  constructor(public navCtrl: NavController,
              private app : App,
              private UserProvider : UserProvider) {
  }


  ngOnInit(){

  }

  goToView(viewName){
    console.log(viewName);
    this.navCtrl.push(viewName);
  }

  async logOut(){
    try{
      let user :any = await this.UserProvider.getCurrentUser();
      user.isLogin = false;
      this.UserProvider.setCurrentUser(user).then(()=>{
        this.app.getRootNav().setRoot('LoginPage');
      })
    }catch (e){
      console.log(JSON.stringify(e));
    }
  }

}
