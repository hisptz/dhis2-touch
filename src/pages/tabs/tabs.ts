import { Component,ViewChild } from '@angular/core';
import {Tabs } from 'ionic-angular';
import { Apps } from '../apps/apps';
import { Account } from '../account/account';
import {User} from "../../providers/user/user";

@Component({
  templateUrl: 'tabs.html',
  providers : [User]
})
export class TabsPage {
  tab1Root: any = Apps;
  tab2Root: any = Account;
  public accountName : string = 'Account';
  //@todo active tabs to have different style
  @ViewChild('myTabs') currentTab: Tabs;

  constructor(private user : User) {
    this.user.getUserData().then(userData=>{
      this.setUserAccountName(userData);
    },error=>{})
  }

  setUserAccountName(userData){
    let newValue = "";
    let nameList = userData.Name.split(' ');
    nameList.forEach(name=>{
      newValue += name.charAt(0).toUpperCase();
    });
    this.accountName = newValue;
  }

  swipeEvent(e) {
    //alert(JSON.stringify(e));
    if(e.velocityX > 0){
      this.currentTab.select(0);
    }else{
      this.currentTab.select(1);
    }
  }

}
