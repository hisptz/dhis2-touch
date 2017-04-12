import { Component,OnInit,Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DataSets} from "../../providers/data-sets";
import {User} from "../../providers/user";

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

  public loadingMessage : string = "";
  public isLoading : boolean = true;
  public currentUser : any;
  public dataSets :any;

  constructor(public navCtrl: NavController, public DataSets : DataSets,public user : User) {}

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

}
