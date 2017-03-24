import { Component,OnInit } from '@angular/core';
import {AccountPage} from "../account/account";
import {AppsPage} from "../apps/apps";
import {User} from "../../providers/user";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit{
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = AppsPage;
  tab2Root: any = AccountPage;
  public accountName : string = 'Account';

  constructor(public user : User) {

  }

  ngOnInit() {
    this.user.getUserData().then(userData=>{
      this.setUserAccountName(userData);
    });
  }

  setUserAccountName(userData){
    let newValue = "";
    if(userData && userData.Name){
      let nameList = userData.Name.split(' ');
      nameList.forEach(name=>{
        newValue += name.charAt(0).toUpperCase();
      });
      this.accountName = newValue;
    }
  }
}
