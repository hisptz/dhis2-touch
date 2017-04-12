import { Component,OnInit,Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the DataSetSync page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-set-sync',
  templateUrl: 'data-set-sync.html'
})
export class DataSetSyncPage  implements OnInit{

  @Input() dataSetsSyncObjects;
  @Input() hasDataPrepared;
  @Input() dataSetIds;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    if(this.hasDataPrepared){

    }
  }

}
