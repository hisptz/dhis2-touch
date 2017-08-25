import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the PeriodSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-period-selection',
  templateUrl: 'period-selection.html',
})
export class PeriodSelectionPage {

  constructor( private navParams: NavParams,private viewCtrl : ViewController) {
  }


  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
