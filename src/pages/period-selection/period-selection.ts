import { Component } from '@angular/core';
import { ViewController,NavParams ,ToastController} from 'ionic-angular';

declare var dhis2: any;
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
    let selectedDataSet = this.params.get('data');
    this.periodType = selectedDataSet.periodType;
    this.openFuturePeriods = parseInt(selectedDataSet.openFuturePeriods);
    this.currentPeriodOffset = 0;
    this.setPeriodSelections();
  }

  setPeriodSelections(){
    //alert(JSON.stringify(dhis2));
    //let periods = dhis2.period.generator.generateReversedPeriods(this.periodType, this.currentPeriodOffset);
    //periods = dhis2.period.generator.filterOpenPeriods(this.periodType, periods, this.openFuturePeriods);
    //if(periods.length > 0){
    //  this.periodList = [];
    //  periods.forEach((period:any)=>{
    //    this.periodList.push({
    //      endDate: period.endDate,
    //      startDate: period.startDate,
    //      iso: period.iso,
    //      name: period.name
    //    });
    //  });
    //}else{
    //  this.setToasterMessage('There is no further period selection for this form');
    //}
  }
  setSelectedDataSet(selectedPeriod){
    this.viewCtrl.dismiss(selectedPeriod);
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
