import { Component,OnInit} from '@angular/core';

import {UserProvider} from "../../providers/user/user";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit{
  tab1Root = 'AppsPage';
  tab2Root = 'AccountsPage';
  accountName : string = 'Account';

  constructor(public user : UserProvider) {

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
