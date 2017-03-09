import { Component ,OnInit} from '@angular/core';
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
export class DataSetSelection implements OnInit{

  public dataSetsList : any;
  public currentSelectedDataSetName : string;

  constructor(public viewCtrl: ViewController,public params : NavParams) {
  }

  ngOnInit() {
    this.setModalData();
  }

  ionViewDidLoad() {
    //console.log('Hello DataSetSelection Page');
  }

  setModalData(){
    this.currentSelectedDataSetName = "";
    this.dataSetsList = this.params.get('data');
    let selectedDataSet = this.params.get('selectedDataSet');
    if(selectedDataSet && selectedDataSet.name){
      this.currentSelectedDataSetName = selectedDataSet.name;
    }
  }

  getFilteredList(ev: any) {
    let val = ev.target.value;
    this.dataSetsList = this.params.get('data');
    if(val && val.trim() != ''){
      this.dataSetsList = this.dataSetsList.filter((dataSet:any) => {
        return (dataSet.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  setSelectedDataSet(selectedDataSet){
    this.viewCtrl.dismiss(selectedDataSet);
  }

  dismiss() {
    var parameter = {};
    this.viewCtrl.dismiss(parameter);
  }

}
