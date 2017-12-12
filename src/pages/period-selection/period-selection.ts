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
  currentPeriod : any;

  periods : Array<any>;
  icon :string;

  constructor( private navParams: NavParams,private viewCtrl : ViewController,private periodSelection : PeriodSelectionProvider) {
  }

  ngOnInit(){
    this.icon = "assets/data-entry/period.png";
    this.periodType = this.navParams.get("periodType");
    this.openFuturePeriods = parseInt(this.navParams.get("openFuturePeriods"));
    this.currentPeriodOffset = parseInt(this.navParams.get("currentPeriodOffset"));
    this.currentPeriod = this.navParams.get("currentPeriod");
    this.loadPeriodSelection();
  }

  loadPeriodSelection(){
    let periods = this.periodSelection.getPeriods(this.periodType,this.openFuturePeriods,this.currentPeriodOffset);
    if(periods.length > 0){
      this.periods = periods;
    }else{
      this.currentPeriodOffset = this.currentPeriodOffset -1;
    }
  }

  changePeriodSelection(currentPeriodOffset){
    this.currentPeriodOffset = currentPeriodOffset;
    this.loadPeriodSelection();
  }

  setSelectedPeriod(selectedPeriod){
    this.periodSelection.setLastSelectedPeriod(selectedPeriod.name);
    this.viewCtrl.dismiss({selectedPeriod: selectedPeriod,currentPeriodOffset : this.currentPeriodOffset});
  }

  dismiss(){
    this.viewCtrl.dismiss({});
  }

}
