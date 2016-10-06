import {Component} from '@angular/core';

import {AppsPage} from '../apps/apps';
import {AccountPage} from '../account/account';

import { User } from '../../providers/user/user';
import {AccountName} from '../../pipes/accountName';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
  providers: [User],
  pipes : [AccountName]
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;

  private accountName : string = 'Account';

  constructor(private user : User) {
    this.tab1Root = AppsPage;
    this.tab2Root = AccountPage;
    this.user.getUserData().then(userData=>{
      this.setUserAccountName(userData);
    },error=>{})
  }

  setUserAccountName(userData){
    this.accountName = userData.Name;
    alert(userData.Name)
  }
}
