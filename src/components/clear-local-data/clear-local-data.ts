import {Component, OnInit} from '@angular/core';
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {AlertController} from "ionic-angular";
import {UserProvider} from "../../providers/user/user";

/**
 * Generated class for the ClearLocalDataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'clear-local-data',
  templateUrl: 'clear-local-data.html'
})
export class ClearLocalDataComponent implements OnInit{

  text: string;

  currentUser: any;

  updateManagerObject : any = {
    dataDeletion : {isExpanded : false,isProcessRunning : false,isDataCleared : true,selectedItems :{}, itemsToBeDeleted : []},
    sendDataViaSms : {isExpanded : true,isSaved : true}
  };


  constructor(public alertCtrl: AlertController, private sqLite: SqlLiteProvider,
              private appProvider: AppProvider, public user: UserProvider) {

  }

  ngOnInit(){
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.user.getUserData().then((userData : any)=>{
        this.currentUser["organisationUnits"] = userData.organisationUnits;
      });
    });
  }


  resetDeletedItems(){
    let deletedTable = [];
    for(let key of Object.keys(this.updateManagerObject.dataDeletion.selectedItems)){
      if(this.updateManagerObject.dataDeletion.selectedItems[key])
        deletedTable.push(key);
    }
    this.updateManagerObject.dataDeletion.itemsToBeDeleted = deletedTable;
  }

  clearDataConfirmation(){
    let alert = this.alertCtrl.create({
      title: 'Clear Data Confirmation',
      message: 'Are you want to clear data?',
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
            this.clearData();
          }
        }
      ]
    });
    alert.present();
  }

  clearData(){
    let deletedItemCount = 0;
    let failCount = 0;
    this.updateManagerObject.dataDeletion.isDataCleared = false;
    for(let tableName of this.updateManagerObject.dataDeletion.itemsToBeDeleted){

      this.sqLite.deleteAllOnTable(tableName,this.currentUser.currentDatabase).then(()=>{
        deletedItemCount = deletedItemCount + 1;
        if((deletedItemCount + failCount) == this.updateManagerObject.dataDeletion.itemsToBeDeleted.length){
          this.appProvider.setNormalNotification("You have successfully clear data");
          Object.keys(this.updateManagerObject.dataDeletion.selectedItems).forEach(key=>{
            this.updateManagerObject.dataDeletion.selectedItems[key] = false;
          });

          this.updateManagerObject.dataDeletion.isDataCleared = true;
          this.updateManagerObject.dataDeletion.isExpanded = false;
        }
      },error=>{
        console.log("Error : " + JSON.stringify(error));
        failCount = failCount + 1;
        if((deletedItemCount + failCount) == this.updateManagerObject.dataDeletion.itemsToBeDeleted.length){
          this.appProvider.setNormalNotification("You.. have successfully clear data.");
          Object.keys(this.updateManagerObject.dataDeletion.selectedItems).forEach(key=>{
            this.updateManagerObject.dataDeletion.selectedItems[key] = false;
          });
          this.updateManagerObject.dataDeletion.isDataCleared = true;
          this.updateManagerObject.dataDeletion.isExpanded = false;
        }
      })
    }
  }


}
