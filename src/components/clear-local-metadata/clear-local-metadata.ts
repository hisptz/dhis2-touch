import {Component, OnInit} from '@angular/core';
import {SyncProvider} from "../../providers/sync/sync";
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
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
  showLoadingMessage: boolean = false;
  clearMetaDataLoadingMessages: string = "";


  constructor(private syncProvider: SyncProvider, private appProvider: AppProvider, private sqLite: SqlLiteProvider, private user: UserProvider,
              public alertCtrl: AlertController, public syncPage: SyncPage) {

  }

  ngOnInit(){
    this.hasAllSelected = false;
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
    });
    this.resources = this.syncPage.getMetadataResoures();
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
    let confirmAlert = this.alertCtrl.create({
      title: 'Delete of Metadata',
      message: 'are you sure you want to delete metadata',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
        },{
          text: 'Delete',
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
      }
    });
    if(resourcesToDelete.length == 0){
      this.appProvider.setNormalNotification("Please select at least one resources to update");
    }else{

      this.deleteResources(resourcesToDelete);
      this.showLoadingMessage = true;
    }
  }


  deleteResources(resources){
    this.clearMetaDataLoadingMessages= "Deleting selected Metadata";
    this.syncProvider.prepareTablesToApplyChanges(resources,this.currentUser).then(()=>{
      this.sqLite.generateTables(this.currentUser.currentDatabase).then(()=>{
        this.autoSelect("un-selectAll");
        this.appProvider.setNormalNotification("Local MetaData deleted successfully.");
        this.showLoadingMessage = false;
      },error=>{
        this.appProvider.setTopNotification("Failed to Drop "+resources+" Database table");
      });
    },error=>{
      this.appProvider.setNormalNotification("Fail to apply updates 0 : " + JSON.stringify(error));
    });
  }


}
