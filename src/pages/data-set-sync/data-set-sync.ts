import { Component,OnInit,Input,Output,EventEmitter } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import {DataSets} from "../../providers/data-sets";
import {User} from "../../providers/user";
import {DataElementSyncContainerPage} from "../data-element-sync-container/data-element-sync-container";

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
  @Input() syncStatus;
  @Input() isDataSetDataDeletionOnProgress;

  @Output() onDeleteDataSetData = new EventEmitter();

  public loadingMessage : string = "";
  public isLoading : boolean = true;
  public currentUser : any;
  public dataSets :any;

  constructor(public navCtrl: NavController, public DataSets : DataSets,
              public alertCtrl: AlertController,
              public user : User) {}

  ngOnInit() {
    if(this.hasDataPrepared){
      this.loadingMessage = "Loading user details";
      this.user.getCurrentUser().then((user)=>{
        this.currentUser = user;
        if(this.dataSetIds && this.dataSetIds.length > 0){
          this.loadDataSetsByIds(this.dataSetIds,this.currentUser);
        }else{
          this.isLoading = false;
        }
      })
    }
  }

  dataSetDataDeleteConfirmation(dataSetName,dataSetId){
    let alert = this.alertCtrl.create({
      title: 'Clear Data Confirmation',
      message: 'Are you want to clear all data on '+ dataSetName +' ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Clear',
          handler: () => {
            this.deleteDataSetData(dataSetName,dataSetId);
          }
        }
      ]
    });
    alert.present();
  }

  deleteDataSetData(dataSetName,dataSetId){
    this.onDeleteDataSetData.emit({dataSetId : dataSetId,dataSetName:dataSetName});
  }

  loadDataSetsByIds(dataSetIds,currentUser){
    this.DataSets.getDataSetsByIds(dataSetIds,currentUser).then((dataSets : any)=>{
      dataSets.forEach((dataSet :any)=>{
        this.dataSetsSyncObjects[dataSet.id].name = dataSet.name;
      });
      this.isLoading = false;
    },error=>{
      this.isLoading = false;
    })
  }

  viewMoreDetailsOnEntryForm(dataSetId){
    this.navCtrl.push(DataElementSyncContainerPage,{
      syncStatus : this.syncStatus,
      dataSetId:dataSetId,
      entryFormName : this.dataSetsSyncObjects[dataSetId].name,
      dataValues : this.dataSetsSyncObjects[dataSetId].dataValues
    })
  }

}
