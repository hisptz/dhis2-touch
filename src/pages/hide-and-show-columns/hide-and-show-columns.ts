import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the HideAndShowColumnsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hide-and-show-columns',
  templateUrl: 'hide-and-show-columns.html'
})
export class HideAndShowColumnsPage implements OnInit, OnDestroy {
  selectedItemsModel: any;
  fieldsToDisplay: any;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.fieldsToDisplay = [];
  }

  ngOnInit() {
    const data = this.navParams.get('data');
    const { columnsToDisplay } = data;
    const { programStage } = data;
    const { programTrackedEntityAttributes } = data;
    const { dataEntrySettings } = data;

    if (columnsToDisplay) {
      _.keys(columnsToDisplay).map(key => {
        this.selectedItemsModel[key] = true;
      });
    }

    console.log('columnsToDisplay : ' + JSON.stringify(columnsToDisplay));
    console.log('programStage : ' + JSON.stringify(programStage));
    console.log(
      'programTrackedEntityAttributes : ' +
        JSON.stringify(programTrackedEntityAttributes)
    );
    console.log('dataEntrySettings : ' + JSON.stringify(dataEntrySettings));

    //columnsToDisplay
    //programStage.programStageDataElements  programStageDataElement.displayInReports
    //programTrackedEntityAttributes //programTrackedEntityAttribute.displayInList
  }

  ngOnDestroy() {
    this.fieldsToDisplay = null;
    this.selectedItemsModel = null;
  }

  trackByFn(index, item) {
    return item.id;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
