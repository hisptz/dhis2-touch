import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { IndicatorsProvider } from '../../../providers/indicators/indicators';

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
  indicatorToValue: any;
  title: string = "Entry form's indicators";
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private indicatorProvider: IndicatorsProvider
  ) {
    this.indicators = [];
    this.indicatorToValue = {};
  }

  ngOnInit() {
    this.indicators = this.navParams.get('indicators');
    const dataValuesObject = this.navParams.get('dataValuesObject');
    const dataSet = this.navParams.get('dataSet');
    if (dataSet && dataSet.name) {
      this.title = dataSet.name + "'s indicators";
    }
    const { indicatorToValue } = this.indicatorProvider.getIndicatorValues(
      this.indicators,
      dataValuesObject
    );
    if (indicatorToValue) {
      this.indicatorToValue = indicatorToValue;
    }
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }
}
