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
  itemsToBeDeleted : any = [];
  selectedItems : any = {};
  isDataCleared :  any = true;
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


  resetDeletedItems(){
    let deletedTable = [];
    for(let key of Object.keys(this.selectedItems)){
      if(this.selectedItems[key])
        deletedTable.push(key);
    }
    this.itemsToBeDeleted = deletedTable;
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
    this.showLoadingMessage = true;
    let deletedItemCount = 0;
    let failCount = 0;
    this.isDataCleared = false;
    for(let tableName of this.itemsToBeDeleted){

      this.sqLite.deleteAllOnTable(tableName,this.currentUser.currentDatabase).then(()=>{
        this.LoadingMessages = "Deleting selected local data";
        deletedItemCount = deletedItemCount + 1;
        if((deletedItemCount + failCount) == this.itemsToBeDeleted.length){

          this.LoadingMessages = "Applying changes to the application";

          this.appProvider.setNormalNotification("You have successfully clear data");

          Object.keys(this.selectedItems).forEach(key=>{
            this.selectedItems[key] = false;
          });
          this.isDataCleared = true;
          this.showLoadingMessage = false;

        }
      },error=>{
        console.log("Error : " + JSON.stringify(error));
        failCount = failCount + 1;
        if((deletedItemCount + failCount) == this.itemsToBeDeleted.length){

          this.appProvider.setNormalNotification("You.. have successfully clear data.");

          Object.keys(this.selectedItems).forEach(key=>{
            this.selectedItems[key] = false;
          });
          this.isDataCleared = true;

        }
      })
    }
  }


}
