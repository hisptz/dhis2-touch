import { Component,OnInit } from '@angular/core';
import { ToastController,AlertController } from 'ionic-angular';
import {SqlLite} from "../../providers/sql-lite";
import {User} from "../../providers/user";
import {AppProvider} from "../../providers/app-provider";
import {UpdateResourceManager} from "../../providers/update-resource-manager";
import {OrganisationUnit} from "../../providers/organisation-unit";
import {DataSets} from "../../providers/data-sets";

/*
  Generated class for the UpdateManagerHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-update-manager-home',
  templateUrl: 'update-manager-home.html'
})

export class UpdateManagerHomePage implements OnInit{

  dataBaseStructure :  any;
  resources : any;
  loadingData : boolean = false;
  loadingMessages : any = [];
  currentUser : any;
  hasAllSelected : boolean;
  hasSelectedResourceUpdated : boolean = false;
  updateManagerObject : any = {
    updateMetadata : {isExpanded : false,isSaved : true,isProcessRunning : false},
    dataDeletion : {isExpanded : false,isProcessRunning : false,isDataCleared : true,selectedItems :{}, itemsToBeDeleted : []},
    sendDataViaSms : {isExpanded : true,isSaved : true}
  };
  updateMetadataLoadingMessages : string = "";
  specialMetadataResources : any;

  constructor(public sqlLite : SqlLite,
              public user : User,public toastCtrl: ToastController,
              public OrganisationUnit : OrganisationUnit,public DataSets : DataSets,
              public alertCtrl: AlertController,public SqlLite : SqlLite,
              public appProvider : AppProvider,public updateResourceManager : UpdateResourceManager) {}

  ngOnInit() {
    this.hasAllSelected = false;
    this.loadingData = true;
    this.loadingMessages = [];
    this.specialMetadataResources = ["organisationUnits","dataSets"];
    this.setLoadingMessages("Loading current user information");
    this.user.getCurrentUser().then((user:any)=>{
      this.currentUser = user;
      this.user.getUserData().then((userData : any)=>{
        this.currentUser["organisationUnits"] = userData.organisationUnits;
        this.setUpdateManagerList();
        this.loadingData = false;
      });
    });
  }

  hideAndShowContents(updateManagerKey){
    if(!this.updateManagerObject[updateManagerKey].isExpanded){
      Object.keys(this.updateManagerObject).forEach(key=>{
        if(key != updateManagerKey){
          this.updateManagerObject[key].isExpanded = false;
        }
      });
    }
    this.updateManagerObject[updateManagerKey].isExpanded = !this.updateManagerObject[updateManagerKey].isExpanded;
  }

  setUpdateManagerList(){
    this.resources = [];
    this.dataBaseStructure = this.sqlLite.getDataBaseStructure();
    Object.keys(this.dataBaseStructure).forEach((resource:any)=>{
      if((this.specialMetadataResources.indexOf(resource) > -1) || (this.dataBaseStructure[resource].canBeUpdated && this.dataBaseStructure[resource].fields !="")){
        this.resources.push({
          name : resource,
          displayName : this.getResourceDisplayName(resource),
          status : false
        })
      }
    });
  }

  getResourceDisplayName(resourceName){
    let displayName : string;
    displayName = (resourceName.charAt(0).toUpperCase() + resourceName.slice(1)).replace(/([A-Z])/g, ' $1').trim();
    return displayName;
  }


  checkingForResourceUpdate(){
    let canUpdate = false;
    let listOfResourceToBeUpdate = [];
    this.resources.forEach((resource:any)=>{
      if(resource.status){
        canUpdate = true;
        listOfResourceToBeUpdate.push(resource);
      }
    });
    if(canUpdate){
      this.updateResources(listOfResourceToBeUpdate);
    }else{
      this.setToasterMessage("Please select at least one resources to update")
    }
  }

  updateResources(resources){
    this.updateMetadataLoadingMessages = "Downloading updates";
    this.updateManagerObject.updateMetadata.isProcessRunning = true;
    this.updateResourceManager.downloadResources(resources,this.specialMetadataResources,this.currentUser).then((resourcesData)=>{
      this.updateMetadataLoadingMessages = "Preparing device to apply updates";
      this.updateResourceManager.prepareDeviceToApplyChanges(resources,this.currentUser).then(()=>{
        let updateCounts = 0;
        this.updateMetadataLoadingMessages = "Applying updates ";
        resources.forEach((resource:any)=>{
          let resourceName = resource.name;
          if(this.specialMetadataResources.indexOf(resourceName) == -1){
            this.appProvider.saveMetadata(resourceName,resourcesData[resourceName],this.currentUser.currentDatabase).then((
            )=>{
              updateCounts ++;
              if(updateCounts == resources.length){
                this.autoSelect("un-selectAll");
                this.updateManagerObject.updateMetadata.isProcessRunning = false;
                this.setToasterMessage("All updates has been applied successfully");
              }
            },error=>{
              this.updateManagerObject.updateMetadata.isProcessRunning = false;
              this.setToasterMessage("Fail to apply updates : " + JSON.stringify(error));
            })
          }else{
            if(resourceName == "organisationUnits"){
              this.OrganisationUnit.savingOrganisationUnitsFromServer(resourcesData[resourceName],this.currentUser).then(()=>{
                updateCounts ++;
                if(updateCounts == resources.length){
                  this.autoSelect("un-selectAll");
                  this.updateManagerObject.updateMetadata.isProcessRunning = false;
                  this.setToasterMessage("All updates has been applied successfully");
                }
              },error=>{
                this.updateManagerObject.updateMetadata.isProcessRunning = false;
                this.setToasterMessage("Fail to apply updates : " + JSON.stringify(error));
              })
            }else if(resourceName == "dataSets"){
              this.DataSets.saveDataSetsFromServer(resourcesData[resourceName],this.currentUser).then(()=>{
                updateCounts ++;
                if(updateCounts == resources.length){
                  this.autoSelect("un-selectAll");
                  this.updateManagerObject.updateMetadata.isProcessRunning = false;
                  this.setToasterMessage("All updates has been applied successfully");
                }
              },error=>{
                this.updateManagerObject.updateMetadata.isProcessRunning = false;
                this.setToasterMessage("Fail to apply updates : " + JSON.stringify(error));
              })
            }
          }
        });
      },error=>{
        this.updateManagerObject.updateMetadata.isProcessRunning = false;
        this.setToasterMessage("Fail to prepare device to apply updates " + JSON.stringify(error));
      });
    },error=>{
      this.updateManagerObject.updateMetadata.isProcessRunning = false;
      this.setToasterMessage("Fail to download updates : " + JSON.stringify(error));
    });
  }


  autoSelect(selectType){
    if(selectType == 'selectAll'){
      this.resources.forEach((resource:any)=>{
        resource.status = true;
      });
      this.hasAllSelected = true;
    }else{
      this.resources.forEach((resource:any)=>{
        resource.status = false;
      });
      this.hasAllSelected = false;
    }
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
      this.SqlLite.deleteAllOnTable(tableName,this.currentUser.currentDatabase).then(()=>{
        deletedItemCount = deletedItemCount + 1;
        if((deletedItemCount + failCount) == this.updateManagerObject.dataDeletion.itemsToBeDeleted.length){
          this.setToasterMessage("You have successfully clear data");
          this.updateManagerObject.dataDeletion.selectedItems = {};
          this.updateManagerObject.dataDeletion.isDataCleared = true;
          this.updateManagerObject.dataDeletion.isExpanded = false;
        }
      },error=>{
        console.log("Error : " + JSON.stringify(error));
        failCount = failCount + 1;
        if((deletedItemCount + failCount) == this.updateManagerObject.dataDeletion.itemsToBeDeleted.length){
          this.setToasterMessage("You have successfully clear data");
          this.updateManagerObject.dataDeletion.selectedItems = {};
          this.updateManagerObject.dataDeletion.isDataCleared = true;
          this.updateManagerObject.dataDeletion.isExpanded = false;
        }
      })
    }
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

}
