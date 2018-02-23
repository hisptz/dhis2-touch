import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DataEntryIndicatorsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-entry-indicators',
  templateUrl: 'data-entry-indicators.html'
})
export class DataEntryIndicatorsPage implements OnInit {
  indicators: any;
  dataSet: any;
  title: string = "Entry form's indicators";
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {}

  ngOnInit() {
    this.indicators = this.navParams.get('indicators');
    this.dataSet = this.navParams.get('dataSet');
    if (this.dataSet && this.dataSet.name) {
      this.title = this.dataSet.name + "'s indicators";
    }
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }
}
