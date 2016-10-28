import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Help page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class Help {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Help Page');
  }

}
