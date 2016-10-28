import { Component } from '@angular/core';
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

}
