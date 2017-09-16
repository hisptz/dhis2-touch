import {Component, OnInit} from '@angular/core';
import {SyncProvider} from "../../providers/sync/sync";
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {UserProvider} from "../../providers/user/user";
import {AlertController} from "ionic-angular";

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

  deleteManagerObject: any= {
    deleteMetaData: {isExpanded: false, isSaved: true, isProcessRunning: false}
  };

  updateMetaDataLoadingMessages: string = "";
  specialMetadataResources: any;

  text: string;

  constructor(private syncProvider: SyncProvider, private appProvider: AppProvider, private sqLite: SqlLiteProvider,
  private orgUnitsProvider: OrganisationUnitsProvider, private datasetsProvider: DataSetsProvider, private user: UserProvider,
              public alertCtrl: AlertController,) {

    console.log('Hello ClearLocalMetadataComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit(){

    this.hasAllSelected = false;
    this.loadingData= true;
    this.loadingMessages= [];

    this.specialMetadataResources = ["organisationUnits","dataSets"];
    //this.setLoadingMessages("Loading current user information");
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.user.getUserData().then((userData : any)=>{
        this.currentUser["organisationUnits"] = userData.organisationUnits;

        this.setUpdaateManagerList();
        this.loadingData = false;
      });
    });

  }

  setUpdaateManagerList(){
    this.resources=[];
    this.dataBaseStructure = this.sqLite.getDataBaseStructure();
    Object.keys(this.dataBaseStructure).forEach((resource:any) =>{
      if(this.dataBaseStructure[resource].isMetadata ){
        this.resources.push({
          name: resource,
          displayName: this.getResourceDisplayName(resource),
          status: false
        })
      }
    });

  }

  getResourceDisplayName(resourceName){
    let displayName: string;
    displayName = (resourceName.charAt(0).toUpperCase()+ resourceName.slice(1)).replace(/([A-Z])/g, '$1').trim();
    return displayName;

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
        //resourcesToDelete.push(resource.name);
        this.deleteResources(resource.name);
        this.showLoadingMessage = true;

      }
    });
    if(resourcesToDelete.length == 0){
      this.appProvider.setNormalNotification("Please select at least one resources to update");
    }

  }


  deleteResources(resources){

    this.updateMetaDataLoadingMessages= "Deleting selected MetaData";
    this.deleteManagerObject.deleteMetaData.isProcessRunning = true;

      this.updateMetaDataLoadingMessages = "Preparing device to apply updates";

  // resources.forEach((resource:any)=>{
  // })

    this.syncProvider.prepareTablesToApplyChanges(resources,this.currentUser).then(()=>{

      this.sqLite.createTable(resources, this.currentUser.currentDatabase).then(()=>{

        let updateCounts = 0;
        this.updateMetaDataLoadingMessages = "Applying changes in application Database";

        updateCounts ++;

        if(resources.length >= updateCounts){
          this.autoSelect("un-selectAll");
          this.deleteManagerObject.deleteMetaData.isProcessRunning = false;
          this.appProvider.setNormalNotification("Local MetaData deleted successfully.");
          this.showLoadingMessage = false;
        }

      },error=>{
        this.appProvider.setTopNotification("Failed to Drop "+resources+" Database table");
      });

    },error=>{
      this.deleteManagerObject.deleteMetaData.isProcessRunning = false;
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
