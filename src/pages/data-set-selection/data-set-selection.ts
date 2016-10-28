import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';

/*
  Generated class for the DataSetSelection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-set-selection',
  templateUrl: 'data-set-selection.html'
})
export class DataSetSelection {

  public dataESetsList : any;

  constructor(public viewCtrl: ViewController,public params : NavParams) {
    this.setModalData();
  }

  ionViewDidLoad() {
    //console.log('Hello DataSetSelection Page');
  }

  setModalData(){
    this.dataESetsList = this.params.get('data');
  }

  setSelectedDataSet(selectedDataSet){
    this.viewCtrl.dismiss(selectedDataSet);
  }

  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }

}
