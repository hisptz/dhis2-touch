import { Component } from '@angular/core';
import { ViewController,NavParams ,ToastController} from 'ionic-angular';

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
export class PeriodSelection {

  public periodList : any;
  public selectedDataSet : any;
  public periodType : any;
  public openFuturePeriods : number;
  public currentPeriodOffset : number;

  constructor(public viewCtrl: ViewController,public params : NavParams,public toastCtrl: ToastController) {
    this.setModalData();
  }

  ionViewDidLoad() {
    //console.log('Hello PeriodSelection Page');
  }

  setModalData(){
    this.periodList = [];
    this.selectedDataSet = this.params.get('selectedDataSet');
    this.currentPeriodOffset = parseInt(this.params.get('currentPeriodOffset'));
    this.setPeriodSelections();
  }

  setPeriodSelections(){
    let periodType = this.selectedDataSet.periodType;
    let openFuturePeriods = parseInt(this.selectedDataSet.openFuturePeriods);
    let periods = dhis2.period.generator.generateReversedPeriods(periodType, this.currentPeriodOffset);
    periods = dhis2.period.generator.filterOpenPeriods(periodType, periods, openFuturePeriods);
    if(periods.length > 0){
      this.periodList = [];
      periods.forEach((period:any)=>{
        this.periodList.push({
          endDate: period.endDate,
          startDate: period.startDate,
          iso: period.iso,
          name: period.name
        });
      });
    }else{
      this.setToasterMessage('There is no further period selection for this form');
      if(this.currentPeriodOffset != 0){
        this.currentPeriodOffset --;
      }
    }
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
      duration: 2500
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
