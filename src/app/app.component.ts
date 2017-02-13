import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {Launcher} from "../pages/launcher/launcher";

@Component({
  template: `<ion-nav [root]="rootPage" color="primary"></ion-nav>`
})
export class MyApp {

  public rootPage : any;

  constructor(public platform: Platform) {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.rootPage = Launcher;
    });
  }
}
