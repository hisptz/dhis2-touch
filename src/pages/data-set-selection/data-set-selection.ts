import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the DataSetSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-set-selection',
  templateUrl: 'data-set-selection.html',
})
export class DataSetSelectionPage {

  constructor(private viewCtrl : ViewController, private navParams: NavParams) {
  }


  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
