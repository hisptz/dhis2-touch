import {Component, OnInit} from '@angular/core';
import {SyncProvider} from "../../providers/sync/sync";
import {AppProvider} from "../../providers/app/app";
import {SqlLiteProvider} from "../../providers/sql-lite/sql-lite";
import {OrganisationUnitsProvider} from "../../providers/organisation-units/organisation-units";
import {DataSetsProvider} from "../../providers/data-sets/data-sets";
import {UserProvider} from "../../providers/user/user";


/**
 * Generated class for the DownloadMetaDataComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'download-meta-data',
  templateUrl: 'download-meta-data.html'
})
export class DownloadMetaDataComponent implements OnInit{

  metaDataContents:any;
  resources: any;
  dataBaseStructure: any;
  currentUser: any;
  hasAllSelected: boolean;
  loadingData: boolean = false;
  loadingMessages: any= [];

  updateManagerObject: any= {
    updateMetaData: {isExpanded: false, isSaved: true, isProcessRunning: false}
  };

  updateMetaDataLoadingMessages: string = "";
  specialMetadataResources: any;



  constructor(private syncProvider: SyncProvider, private appProvider: AppProvider, private sqLite: SqlLiteProvider,
              private orgUnitsProvider: OrganisationUnitsProvider, private datasetsProvider: DataSetsProvider, private user: UserProvider) {

   //this.metaDataContents = this.syncProvider.getMetaDataNames();

  }
  ngOnInit(){
    this.hasAllSelected = false;
    this.loadingData= true;
    this.loadingMessages= [];
    //this.setUpdaateManagerList();

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



  // Codes from download-meta-data.ts

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

  checkingForResourceUpdate(){
    let isMetadata= false;
    let listOfResourcesToBeUpdated = [];
    this.resources.forEach((resource:any) =>{
      if(resource.status){
        isMetadata= true;
        listOfResourcesToBeUpdated.push(resource.name);
      }
    });
    if(listOfResourcesToBeUpdated.length > 0){
      this.updateResources(listOfResourcesToBeUpdated);
    }

  }


  updateResources(resources){
    this.updateMetaDataLoadingMessages= "Downloading MetaData";
    this.syncProvider.downloadResources(resources, this.specialMetadataResources,this.currentUser).then((resourcesData)=>{
      alert("Update Resource "+JSON.stringify(resourcesData))

      // this.updateMetaDataLoadingMessages = "Preparing device to apply updates";
      // this.syncProvider.prepareDeviceToApplyChanges(resources,this.currentUser).then(()=>{
      //   let updateCounts = 0;
      //   this.updateMetaDataLoadingMessages = "Applying updates ";
      //   this.appProvider.setNormalNotification("Applying updates tracking.....");
      //
      //   resources.forEach((resource:any)=>{
      //     let resourceName = resource.name;
      //
      //     if(this.specialMetadataResources.indexOf(resourceName) >= -1){
      //
      //       this.appProvider.saveMetadata(resourceName,resourcesData[resourceName],this.currentUser.currentDatabase).then((
      //       )=>{
      //         updateCounts ++;
      //         //this.appProvider.setNormalNotification("updateCount: "+updateCounts+ "     resources length: "+resources.length);
      //         if(updateCounts == resources.length){
      //           this.autoSelect("un-selectAll");
      //          // this.updateManagerObject.updateMetadata.isProcessRunning = false;
      //           this.appProvider.setNormalNotification("All updates has been applied successfully");
      //         }
      //       },error=>{
      //         //this.updateManagerObject.updateMetadata.isProcessRunning = false;
      //         this.appProvider.setNormalNotification("Fail to apply updates 0 : " + JSON.stringify(error));
      //       })
      //     }else{
      //
      //         if(resourceName == "organisationUnits"){
      //           this.orgUnitsProvider.savingOrganisationUnitsFromServer(resourcesData[resourceName],this.currentUser).then(()=>{
      //             updateCounts ++;
      //             if(updateCounts == resources.length){
      //               this.autoSelect("un-selectAll");
      //               this.updateManagerObject.updateMetadata.isProcessRunning = false;
      //               this.appProvider.setNormalNotification("All updates has been applied successfully");
      //             }
      //           },error=>{
      //             this.updateManagerObject.updateMetadata.isProcessRunning = false;
      //             this.appProvider.setNormalNotification("Fail to apply updates 1: " + JSON.stringify(error));
      //           })
      //         }else if(resourceName == "dataSets"){
      //           this.datasetsProvider.saveDataSetsFromServer(resourcesData[resourceName],this.currentUser).then(()=>{
      //             updateCounts ++;
      //             if(updateCounts == resources.length){
      //               this.autoSelect("un-selectAll");
      //               this.updateManagerObject.updateMetadata.isProcessRunning = false;
      //               this.appProvider.setNormalNotification("All updates has been applied successfully");
      //             }
      //           },error=>{
      //             this.updateManagerObject.updateMetadata.isProcessRunning = false;
      //             this.appProvider.setNormalNotification("Fail to apply updates 2 : " + JSON.stringify(error));
      //           })
      //         }
      //     }
      //
      //   });
      // },error=>{
      //   this.updateManagerObject.updateMetadata.isProcessRunning = false;
      //   this.appProvider.setNormalNotification("Fail to prepare device to apply updates " + JSON.stringify(error));
      // });
    },error=>{
      this.updateManagerObject.updateMetadata.isProcessRunning = false;
      this.appProvider.setNormalNotification("Fail to download updates : " + JSON.stringify(error));
    });


  }





}
