import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {EventCaptureHome} from "../event-capture-home/event-capture-home";
import {ReportHome} from "../report-home/report-home";
import {DataEntryHome} from "../data-entry-home/data-entry-home";
import {DashBoardHome} from "../dash-board-home/dash-board-home";
import {TrackerCaptureHome} from "../tracker-capture-home/tracker-capture-home";


/*
  Generated class for the Apps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-apps',
  templateUrl: 'apps.html'
})
export class Apps {

  public viewMapperObject : any;

  constructor(public navCtrl: NavController) {
    this.setViewAction();
  }

  ionViewDidLoad() {
    //console.log('Hello Apps Page');
  }

  setViewAction():void{
    this.viewMapperObject = {
      "dataEntry" : DataEntryHome,
      "eventCapture" : EventCaptureHome,
      "report" : ReportHome,
      "dashboard" : DashBoardHome,
      "trackerCapture" : TrackerCaptureHome
    }
  }

  goToView(viewName){
    this.navCtrl.push(this.viewMapperObject[viewName]);
  }

}
