import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DataEntryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry',
  templateUrl: 'data-entry.html',
})
export class DataEntryPage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){

  }

}
