import {Component, OnInit} from '@angular/core';
import {SyncProvider} from "../../providers/sync/sync";
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {UserProvider} from "../../providers/user/user";
import {AlertController} from "ionic-angular";
import {SyncPage} from "../../pages/sync/sync";

/**
 * Generated class for the ClearLocalMetadataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'clear-local-metadata',
  templateUrl: 'clear-local-metadata.html'
})
export class ClearLocalMetadataComponent implements OnInit{

  resources: any;
  dataBaseStructure: any;
  currentUser: any;
  hasAllSelected: boolean;
  isLoading: boolean = false;
  loadingMessage: string = "";

  constructor(private syncProvider: SyncProvider, private appProvider: AppProvider, private sqLite: SqlLiteProvider, private user: UserProvider,
              public alertCtrl: AlertController, public syncPage: SyncPage) {

  }

  ngOnInit(){
    this.hasAllSelected = false;
    this.user.getCurrentUser().subscribe((user:any)=>{
      this.currentUser = user;
    });
    this.resources = this.syncPage.resources;
    this.autoSelect("");
  }


  autoSelect(selectType){
    if(selectType== 'selectAll'){
      this.resources.forEach((resource:any) =>{
        resource.status = true;
      });
      this.hasAllSelected = true;
    }else{
      this.resources.forEach((resource:any) =>{
        resource.status = false;
      });
      this.hasAllSelected = false;
    }
  }

  verifyingDeleteOfResources(){
    let displayList = [];
    this.resources.forEach((resource:any) =>{
      if(resource.status){
        displayList.push(resource.displayName);
      }
    });
    let confirmAlert = this.alertCtrl.create({
      title: 'Clear local metadata confirmation',
      message: 'You are about to clear \n' +
                ' \t' + ' '+displayList.join(', ') + ". Are you sure?",
      buttons:[
        {
          text: 'No',
          role: 'cancel',
        },{
          text: 'Yes',
          handler:() =>{
            this.checkingForResourceToDelete();
          }
        }
      ]
    });
    confirmAlert.present();
  }

  checkingForResourceToDelete(){
    let isMetadata= false;
    let resourcesToDelete = [];
    this.resources.forEach((resource:any) =>{
      if(resource.status){
        isMetadata= true;
        resourcesToDelete.push(resource.name);
        if(resource.dependentTable.length > 0){
          resource.dependentTable.forEach((tableNames: any)=>{
            resourcesToDelete.push(tableNames)
          });
        }
      }
    });
    if(resourcesToDelete.length == 0){
      this.appProvider.setNormalNotification("Please select at least one resources to update");
    }else{
      this.deleteResources(resourcesToDelete);
      this.isLoading = true;
    }
  }


  deleteResources(resources){
    this.loadingMessage= "Clearing selected Metadata";
    this.syncProvider.prepareTablesToApplyChanges(resources,this.currentUser).subscribe(()=>{
      this.loadingMessage= "Applying updates";
      this.sqLite.generateTables(this.currentUser.currentDatabase).subscribe(()=>{
        this.autoSelect("un-selectAll");
        this.appProvider.setNormalNotification("All selected local metadata has been cleared successfully");
        this.isLoading = false;
      },error=>{
        this.appProvider.setTopNotification("Failed. to Drop "+resources+" Database table");
      });
    },error=>{
      this.appProvider.setNormalNotification("Fail to apply updates 0 : " + JSON.stringify(error));
    });
  }
}
