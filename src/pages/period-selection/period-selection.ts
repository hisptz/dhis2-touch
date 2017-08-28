import { Component,OnInit } from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {PeriodSelectionProvider} from "../../providers/period-selection/period-selection";

/**
 * Generated class for the PeriodSelectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-period-selection',
  templateUrl: 'period-selection.html',
})
export class PeriodSelectionPage implements  OnInit{

  periodType : string;
  openFuturePeriods : number;
  currentPeriodOffset : number;

  periods : Array<any>;

  constructor( private navParams: NavParams,private viewCtrl : ViewController,private periodSelection : PeriodSelectionProvider) {
  }

  ngOnInit(){
    this.periodType = this.navParams.get("periodType");
    this.openFuturePeriods = parseInt(this.navParams.get("openFuturePeriods"));
    this.currentPeriodOffset = parseInt(this.navParams.get("currentPeriodOffset"));
    this.loadPeriodSelection();
  }

  loadPeriodSelection(){
    this.periods = this.periodSelection.getPeriods(this.periodType,this.openFuturePeriods,this.currentPeriodOffset);
  }


  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
