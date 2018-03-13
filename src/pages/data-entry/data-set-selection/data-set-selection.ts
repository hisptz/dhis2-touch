import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { AppTranslationProvider } from '../../../providers/app-translation/app-translation';

/**
 * Generated class for the DataSetSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-set-selection',
  templateUrl: 'data-set-selection.html'
})
export class DataSetSelectionPage implements OnInit {
  dataSetsList: any;
  currentDataSet: any;
  icon: string;
  translationMapper: any;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private appTranslation: AppTranslationProvider
  ) {}

  ngOnInit() {
    this.icon = 'assets/icon/form.png';
    this.dataSetsList = this.navParams.get('dataSetsList');
    this.currentDataSet = this.navParams.get('currentDataSet');
    this.translationMapper = {};
    this.appTranslation.getTransalations(this.getValuesToTranslate()).subscribe(
      (data: any) => {
        this.translationMapper = data;
      },
      error => {}
    );
  }
  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.dataSetsList = this.navParams.get('dataSetsList');
    if (val && val.trim() != '') {
      this.dataSetsList = this.dataSetsList.filter((dataSet: any) => {
        return dataSet.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  setSelectedDataSet(selectedDataSet) {
    this.viewCtrl.dismiss(selectedDataSet);
  }
  dismiss() {
    this.viewCtrl.dismiss({});
  }

  getValuesToTranslate() {
    return ['There is no data entry form to select'];
  }
}
