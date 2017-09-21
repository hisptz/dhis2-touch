import {Component, OnInit} from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {DataValuesProvider} from "../../providers/data-values/data-values";
import {SyncProvider} from "../../providers/sync/sync";

/**
 * Generated class for the UploadViaInternetComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'upload-data-via-internet',
  templateUrl: 'upload-via-internet.html'
})
export class UploadViaInternetComponent implements OnInit{


  currentUser: any;
  selectedItems : any = {};
  isLoading : boolean;
  loadingMessage: string;
  itemsToUpload : Array<string>;


  constructor(private dataValuesProvider : DataValuesProvider,
              private syncProvider : SyncProvider,
              private appProvider: AppProvider, public user: UserProvider) {
  }

  ngOnInit(){
    this.isLoading = true;
    this.itemsToUpload = [];
    this.loadingMessage = "Loading user information";
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.isLoading = false;
    },error=>{
    });
  }

  updateItemsToUpload(){
    this.itemsToUpload = [];
    Object.keys(this.selectedItems).forEach((key: string)=>{
      if(this.selectedItems[key]){
        this.itemsToUpload.push(key);
      }
    });
  }

  uploadData(){
    this.loadingMessage = "Loading data to be uploaded";
    this.isLoading = true;
    this.syncProvider.getDataforUploading(this.itemsToUpload,this.currentUser).then((data : any)=>{
      console.log(JSON.stringify(data));
    },eeror=>{
      this.appProvider.setNormalNotification("Fail to load data")
    })
  }


}
