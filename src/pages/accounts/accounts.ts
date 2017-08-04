import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {LoginPage} from "../login/login";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,private UserProvider : UserProvider) {
  }


  ngOnInit(){

  }

  goToView(viewName){
    console.log('View name is : ' + viewName);
  }

  async logOut(){
    try{
      let user :any = await this.UserProvider.getCurrentUser();
      user.isLogin = false;
      this.UserProvider.setCurrentUser(user).then(()=>{
        this.navCtrl.setRoot(LoginPage)
      })
    }catch (e){
      console.log(JSON.stringify(e));
    }
  }

}
