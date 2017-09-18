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
  loadingData: boolean = false;
  loadingMessages: any= [];
  showLoadingMessage: boolean = false;
  isProcessRunning: any = false;


  clearMetaDataLoadingMessages: string = "";
  specialMetadataResources: any;



  constructor(private syncProvider: SyncProvider, private appProvider: AppProvider, private sqLite: SqlLiteProvider, private user: UserProvider,
              public alertCtrl: AlertController, public syncPage: SyncPage) {

  }

  ngOnInit(){

    this.hasAllSelected = false;
    this.loadingData= true;
    this.loadingMessages= [];

    this.specialMetadataResources = ["organisationUnits","dataSets"];
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;

      this.loadingData = false;
    });

    this.resources = this.syncPage.getMetadataResoures();

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
            this.checkingForResourcetoDelete();
          }
        }
      ]
    });
    confirmAlert.present();
  }

  checkingForResourcetoDelete(){
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

    this.clearMetaDataLoadingMessages= "Deleting selected MetaData";
    this.isProcessRunning = true;

      this.clearMetaDataLoadingMessages = "Preparing device to apply updates";

    this.syncProvider.prepareTablesToApplyChanges(resources,this.currentUser).then(()=>{

      this.clearMetaDataLoadingMessages = "Re-organize application database";

      this.sqLite.createTable(resources, this.currentUser.currentDatabase).then(()=>{

        let updateCounts = 0;
        this.clearMetaDataLoadingMessages = "Applying changes in application Database";

        updateCounts ++;

        if(resources.length >= updateCounts){
          this.autoSelect("un-selectAll");
          this.isProcessRunning = false;
          this.appProvider.setNormalNotification("Local MetaData deleted successfully.");
          this.showLoadingMessage = false;
        }

      },error=>{
        this.appProvider.setTopNotification("Failed to Drop "+resources+" Database table");
      });

    },error=>{
      this.isProcessRunning = false;
      this.appProvider.setNormalNotification("Fail to apply updates 0 : " + JSON.stringify(error));
    });







  }

  displayOneAtTime(){
    this.resources.forEach((resource:any)=>{
      if(resource.status){
        alert("Now its: "+resource.name)
      }
    })
  }



}
