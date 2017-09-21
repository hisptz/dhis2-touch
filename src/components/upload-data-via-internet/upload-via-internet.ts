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
    this.syncProvider.getDataForUploading(this.itemsToUpload,this.currentUser).then((data : any)=>{
      let shouldUpload = false;
      this.itemsToUpload.forEach(item=>{
        if(data[item] && data[item].length > 0 ){
          shouldUpload =true;
        }
      });
      if(shouldUpload){
        this.loadingMessage = "Prepare data for uploading";
        this.syncProvider.prepareDataForUploading(data).then((preparedData : any)=>{
          this.loadingMessage = "Uploading data";
          this.syncProvider.uploadingData(preparedData,data,this.currentUser).then((response)=>{
            this.isLoading = false;
            console.log(JSON.stringify(response));
            this.appProvider.setNormalNotification("Data have been uploaded successfully, you can check summary");
          },error=>{
            this.isLoading = false;
            this.appProvider.setNormalNotification("Fail to upload data");
          });
        },error=>{
          this.isLoading = false;
          this.appProvider.setNormalNotification("Fail to prepare data");
        })
      }else{
        this.isLoading = false;
        this.appProvider.setNormalNotification("There are nothing so upload to the server");
      }
    },error=>{
      this.isLoading = false;
      this.appProvider.setNormalNotification("Fail to load data");
    })
  }


}
