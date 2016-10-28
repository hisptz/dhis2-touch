import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the PeriodSelection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-period-selection',
  templateUrl: 'period-selection.html'
})
export class PeriodSelection {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello PeriodSelection Page');
  }

}
