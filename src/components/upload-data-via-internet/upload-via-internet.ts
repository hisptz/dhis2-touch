import {Component, OnInit} from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {SyncProvider} from "../../providers/sync/sync";
import {ModalController} from "ionic-angular";

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
  importSummaries : any;


  constructor(private syncProvider : SyncProvider,private modalCtrl : ModalController,
              private appProvider: AppProvider, public user: UserProvider) {
  }

  ngOnInit(){
    this.isLoading = true;
    this.itemsToUpload = [];
    this.loadingMessage = "Loading user information";
    this.importSummaries = null;
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
            this.importSummaries = response;
            this.viewUploadImportSummaries();
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

  viewUploadImportSummaries(){
    if(this.importSummaries){
      let modal = this.modalCtrl.create('ImportSummariesPage',{importSummaries : this.importSummaries});
      modal.onDidDismiss(()=>{
        
      });
      modal.present();
    }
  }


}
