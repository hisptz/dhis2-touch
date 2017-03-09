import { Component, OnInit} from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {ReportView} from "../report-view/report-view";

/*
  Generated class for the ReportParameterSelection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report-parameter-selection',
  templateUrl: 'report-parameter-selection.html'
})
export class ReportParameterSelection implements OnInit{

  public reportId : string;
  public reportName : string;
  public reportParams : any;

  constructor(public navCtrl: NavController,private params:NavParams) {
  }

  ngOnInit() {
    this.reportName = this.params.get('name');
    this.reportId = this.params.get("id");
    this.reportParams = this.params.get("reportParams");
  }

  ionViewDidLoad() {

  }

  goToView(){
    let parameter = {
      id : this.reportId,name : this.reportName
    };
    this.navCtrl.push(ReportView,parameter);
  }

}
