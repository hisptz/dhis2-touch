import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar,Splashscreen} from 'ionic-native';

import { TabsPage } from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';


@Component({
  template: '<ion-nav [root]="rootPage" primary></ion-nav>'
})
export class MyApp {

  private rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}

ionicBootstrap(MyApp,[], {
  tabsPlacement: 'top'
});
