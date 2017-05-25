import { Component,OnInit } from '@angular/core';
import { ViewController,NavParams ,ToastController} from 'ionic-angular';
import {PeriodService} from "../../providers/period-service";

declare var dhis2;
/*
  Generated class for the PeriodSelection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-period-selection',
  templateUrl: 'period-selection.html'
})
export class PeriodSelection implements OnInit{

  public periodList : any;
  public selectedDataSet : any;
  public periodType : any;
  public openFuturePeriods : number;
  public currentPeriodOffset : number;

  constructor(public viewCtrl: ViewController,public params : NavParams,
              public PeriodService : PeriodService,
              public toastCtrl: ToastController) {

  }

  ngOnInit() {
    this.setModalData();
  }


  setModalData(){
    this.periodList = [];
    this.selectedDataSet = this.params.get('selectedDataSet');
    this.currentPeriodOffset = parseInt(this.params.get('currentPeriodOffset'));
    this.setPeriodSelections();
  }

  setPeriodSelections(){
    let periods = this.PeriodService.getPeriods(this.selectedDataSet,this.currentPeriodOffset);
    if(periods.length > 0){
      this.setPeriodList(periods);
    }else if(periods.length == 0 && this.currentPeriodOffset == 0){
      this.currentPeriodOffset = this.currentPeriodOffset -1;
      periods = this.PeriodService.getPeriods(this.selectedDataSet,this.currentPeriodOffset);
      this.setPeriodList(periods);
    }
    else{
      this.setToasterMessage('There is no further period selection for this form');
      if(this.currentPeriodOffset != 0){
        this.currentPeriodOffset --;
      }
    }
  }

  setPeriodList(periods){
    this.periodList = [];
    periods.forEach((period:any)=>{
      this.periodList.push({
        endDate: period.endDate,
        startDate: period.startDate,
        iso: period.iso,
        name: period.name
      });
    });
  }

  previous(){
    this.currentPeriodOffset --;
    this.setPeriodSelections();
  }

  next(){
    this.currentPeriodOffset ++;
    this.setPeriodSelections();
  }

  setSelectedPeriod(selectedPeriod){
    this.viewCtrl.dismiss({selectedPeriod: selectedPeriod,currentPeriodOffset : this.currentPeriodOffset});
  }

  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3500
    });
    toast.present();
  }

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }
}
