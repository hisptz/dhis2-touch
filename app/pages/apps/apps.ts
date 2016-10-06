import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import {DashboardHomePage} from '../dashboard-home/dashboard-home';
import {DataEntryHomePage} from '../data-entry-home/data-entry-home';
import {EventCaptureHomePage} from '../event-capture-home/event-capture-home';
import {ReportHomePage} from '../report-home/report-home';
import {TrackerCaptureHomePage} from '../tracker-capture-home/tracker-capture-home';

/*
  Generated class for the AppsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/apps/apps.html',
})
export class AppsPage {

  private viewMapperObject : any;

  constructor(private navCtrl: NavController) {
    this.viewMapperObject = {
      "dataEntry" : DataEntryHomePage,
      "eventCapture" : EventCaptureHomePage,
      "report" : ReportHomePage,
      "dashboard" : DashboardHomePage,
      "trackerCapture" : TrackerCaptureHomePage
    }
  }

  goToView(viewName){
    this.navCtrl.push(this.viewMapperObject[viewName]);
  }



}
