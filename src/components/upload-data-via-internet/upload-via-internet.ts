import {Component, OnInit} from '@angular/core';
import {UserProvider} from "../../providers/user/user";
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {AlertController} from "ionic-angular";

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
  itemsToBeUploaded : any = [];
  selectedItems : any = {};
  isDataUploaded :  any = true;
  showLoadingMessage: boolean = false;
  LoadingMessages: string;


  constructor(public alertCtrl: AlertController, private sqLite: SqlLiteProvider,
              private appProvider: AppProvider, public user: UserProvider) {

  }

  ngOnInit(){
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
    });
  }


  resetUploadItems(){
    let updateTable = [];
    for(let key of Object.keys(this.selectedItems)){
      if(this.selectedItems[key])
        updateTable.push(key);
    }
    this.itemsToBeUploaded = updateTable;
  }

  uploadDataConfirmation(){
    let alert = this.alertCtrl.create({
      title: 'Upload Data Confirmation',
      message: 'Are you want to upload selected data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Upload',
          handler: () => {
            this.uploadData();
          }
        }
      ]
    });
    alert.present();
  }

  uploadData(){
    this.showLoadingMessage = true;
    let uploadedItemCount = 0;
    let failCount = 0;
    this.isDataUploaded = false;
    for(let tableName of this.itemsToBeUploaded){

      this.sqLite.getAllDataFromTable(tableName,this.currentUser.currentDatabase).then((response:any)=>{

        this.LoadingMessages = "Fetching selected local data";
        uploadedItemCount = uploadedItemCount + 1;
        if((uploadedItemCount + failCount) == this.itemsToBeUploaded.length){

          this.LoadingMessages = "Applying changes to the application";

          this.appProvider.setNormalNotification("You have successfully uploaded data");

          Object.keys(this.selectedItems).forEach(key=>{
            this.selectedItems[key] = false;
          });
          this.isDataUploaded = true;
          this.showLoadingMessage = false;

        }
      },error=>{
        console.log("Error : " + JSON.stringify(error));
        failCount = failCount + 1;
        if((uploadedItemCount + failCount) == this.itemsToBeUploaded.length){

          this.appProvider.setNormalNotification("You.. have successfully clear data.");

          Object.keys(this.selectedItems).forEach(key=>{
            this.selectedItems[key] = false;
          });
          this.isDataUploaded = true;

        }
      })
    }
  }


}
