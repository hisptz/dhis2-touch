import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SqlLite} from "../../providers/sql-lite";
import {DataEntryHomePage} from "../data-entry-home/data-entry-home";
import {EventCaptureHomePage} from "../event-capture-home/event-capture-home";
import {DashBoardHomePage} from "../dash-board-home/dash-board-home";
import {ReportHomePage} from "../report-home/report-home";

declare var dhis2;
/*
  Generated class for the Apps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-apps',
  templateUrl: 'apps.html'
})
export class AppsPage implements OnInit{

  public viewMapperObject : any;

  constructor(public navCtrl: NavController,public SqlLite : SqlLite) {
  }

  ngOnInit() {
    dhis2.dataBaseStructure =  this.SqlLite.getDataBaseStructure();
    this.viewMapperObject = {
      "dataEntry" : DataEntryHomePage,
      "eventCapture" : EventCaptureHomePage,
      "report" : ReportHomePage,
      "dashboard" : DashBoardHomePage
    }
  }

  goToView(viewName){
    this.navCtrl.push(this.viewMapperObject[viewName]);
  }

}
