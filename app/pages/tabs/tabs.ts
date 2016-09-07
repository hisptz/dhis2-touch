import {Component} from '@angular/core';

import {AppsPage} from '../apps/apps';
import {AccountPage} from '../account/account';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = AppsPage;
    this.tab2Root = AccountPage;
  }
}
