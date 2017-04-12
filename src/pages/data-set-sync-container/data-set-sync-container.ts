import { Component,OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the DataSetSyncContainer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-data-set-sync-container',
  templateUrl: 'data-set-sync-container.html'
})
export class DataSetSyncContainerPage  implements OnInit{

  public loading : boolean = true;
  public loadingMessages : string = "";
  public hasDataPrepared : boolean = false;
  public dataSetsSyncObjects : any = {};
  public dataSetIds : any = [];
  public syncStatus : string = "";
  public headerLabel : string;

  constructor(public navParams: NavParams) {}

  ngOnInit() {
    this.headerLabel = "List of ";
    this.headerLabel += (this.navParams.get("syncStatus") == "synced")? "synced": "un synced ";
    this.headerLabel += " entry forms";
    this.syncStatus = (this.navParams.get("syncStatus") == "synced")? "Synced" : "Not Synced";

    this.navParams.get("dataValues").forEach((dataValue : any)=>{
      this.loadingMessages = "Grouping data by entry form";
      if(!this.dataSetsSyncObjects[dataValue.dataSetId]){
        this.dataSetIds.push(dataValue.dataSetId);
        this.dataSetsSyncObjects[dataValue.dataSetId] = {
          id :dataValue.dataSetId,name : "",dataValues : []
        };
      }
      this.dataSetsSyncObjects[dataValue.dataSetId].dataValues.push(dataValue);
    });
    this.hasDataPrepared = true;
    this.loading = false;
  }

}
