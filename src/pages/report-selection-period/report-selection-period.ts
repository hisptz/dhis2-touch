import { Component,OnInit } from '@angular/core';
import { ViewController,NavParams ,ToastController} from 'ionic-angular';

/*
 Generated class for the ReportSelectionPeriod page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-report-selection-period',
  templateUrl: 'report-selection-period.html'
})
export class ReportSelectionPeriod implements OnInit{

  public periodList : any = [];

  constructor(public viewCtrl: ViewController,public params : NavParams,public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.setModalData();
  }

  setModalData(){
    let year = new Date().getFullYear();
    this.setPeriodSelections(year);
  }

  setPeriodSelections(year){
    if(parseInt(year) > new Date().getFullYear()){
      var message = "There no period option further than this at moment";
      this.setToasterMessage(message);
    }else{
      this.periodList = this.getPeriodOption(year);
    }
  }

  previous(){
    let  periodOptionLength = this.periodList.length;
    if(this.periodList[periodOptionLength-1]){
      let year = this.periodList[periodOptionLength-1].iso;
      this.setPeriodSelections(year);
    }
  }

  next(){
    if(this.periodList[0]){
      let year = parseInt(this.periodList[0].iso);
      year +=4;
      this.setPeriodSelections(year);
    }
  }

  getPeriodOption(year){
    var period = [];
    for(var i = 0; i < 5; i ++){
      var newYearValue = year - i;
      period.push({
        name : newYearValue,
        iso : newYearValue
      });
    }
    return period;
  }


  setSelectedPeriod(selectedPeriod){
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

}
