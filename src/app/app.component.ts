import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;

  constructor(platform: Platform, statusBar: StatusBar,
              TranslateService : TranslateService,
              splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      TranslateService.setDefaultLang('en');
      splashScreen.hide();
      this.rootPage = 'LauncherPage';

    });
  }
}
