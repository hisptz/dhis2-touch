import { Component,OnInit } from '@angular/core';
import {NavParams, NavController, IonicPage} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {DataValuesProvider} from "../../providers/data-values/data-values";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";

/*
  Generated class for the DataSetSyncContainer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-data-values-sync-container',
  templateUrl: 'data-values-sync-container.html'
})
export class DataValuesSyncContainerPage  implements OnInit{

  public loading : boolean = true;
  public loadingMessages : string = "";
  public hasDataPrepared : boolean = false;
  public dataSetsSyncObjects : any = {};
  public isDataSetDataDeletionOnProgress : any = {};
  public dataSetIds : any = [];
  public syncStatus : string = "";
  public headerLabel : string;
  public currentUser : any;
  idArray: any = {};
  dataSetIdList: any = [];

  constructor(public navParams: NavParams,
              public user : UserProvider,
              public navCtrl: NavController,
              public dataValuesProvider : DataValuesProvider) {}

  ngOnInit() {
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.initiateData();
    });
  }

  initiateData(){
    this.headerLabel = "List of ";
    this.headerLabel += (this.navParams.get("syncStatus") == "synced")? "synced": "un synced ";
    this.headerLabel += " entry forms";
    this.syncStatus = (this.navParams.get("syncStatus") == "synced")? "Synced" : "Not synced";

    this.navParams.get("dataValues").forEach((dataValue : any)=>{
      this.loadingMessages = "Grouping data by entry form";
      this.isDataSetDataDeletionOnProgress[dataValue.dataSetId] = false;
      if(!this.dataSetsSyncObjects[dataValue.dataSetId]){
        this.dataSetIds.push(dataValue.dataSetId);

        this.dataSetsSyncObjects[dataValue.dataSetId] = {
          id :dataValue.dataSetId,name : "",dataValues : []
        };
      }

      this.dataSetsSyncObjects[dataValue.dataSetId].dataValues.push(dataValue);
    });
    this.loading = false;
  }

  onDeleteDataSetData(event){
    this.loadingMessages = "Clear all data on " + event.dataSetName;
    this.isDataSetDataDeletionOnProgress[event.dataSetId] = true;
    let dataValueIds = [];
    for(let dataValue of this.dataSetsSyncObjects[event.dataSetId].dataValues){
      if(dataValue && dataValue.id){
        dataValueIds.push(dataValue.id);
      }
    }
    if(dataValueIds.length > 0){
      this.dataValuesProvider.deleteDataValueByIds(dataValueIds,this.currentUser).then(()=>{
        setTimeout(()=>{
          delete this.dataSetsSyncObjects[event.dataSetId];
          if(this.dataSetsSyncObjects && Object.keys(this.dataSetsSyncObjects).length > 0){
            this.isDataSetDataDeletionOnProgress[event.dataSetId] = false;

          }else{
            this.navCtrl.pop();

          }
        },500);
      },error=>{});
    }
  }


}
