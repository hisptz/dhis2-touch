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
  resourceToUpdate = [];
  showLoadingMessage: boolean = false;
  isProcessRunning: boolean = false;

  updateMetaDataLoadingMessages: string = "";
  specialMetadataResources: any;



  constructor(private syncProvider: SyncProvider, private appProvider: AppProvider, private sqLite: SqlLiteProvider, private user: UserProvider,
              public syncPage: SyncPage) {


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


  checkForSelectedItems(){
    if(this.resourceToUpdate.length > 0){
      this.checkingForResourceUpdate()
    }else{
      this.appProvider.setNormalNotification("Please select at least one resources to update");
    }
  }


  checkingForResourceUpdate(){
    let isMetadata= false;
    let resourceUpdated = [];
    this.resources.forEach((resource:any) =>{
      if(resource.status){
        isMetadata= true;
        resourceUpdated.push(resource.name);
        this.resourceToUpdate.push(resource.name);
        //this.updateResources(resource.name);
        this.showLoadingMessage = true;
      }
    });
    if(resourceUpdated.length == 0){

      this.appProvider.setNormalNotification("Please select at least one resources to update");
    }else{
    this.updateResources(resourceUpdated);
    }

  }


  updateResources(resources) {
    this.updateMetaDataLoadingMessages = "Downloading selected MetaData";
    this.isProcessRunning = true;


    this.syncProvider.downloadResources(resources, this.specialMetadataResources, this.currentUser).then((resourcesData) => {

      this.updateMetaDataLoadingMessages = "Preparing device to apply updates";

      //alert("ResourcesData Values: " + JSON.stringify(resourcesData))

      this.syncProvider.prepareTablesToApplyChanges(resources, this.currentUser).then(() => {

        this.updateMetaDataLoadingMessages = "Re-organize application database";

        this.sqLite.createTable(resources, this.currentUser.currentDatabase).then(() => {


          let updateCounts = 0;
          this.updateMetaDataLoadingMessages = "Applying downloaded updates ";

           resources.forEach((resource: any) => {
            let resourceName = resource;

          if (this.specialMetadataResources.indexOf(resourceName) >= -1) {

            this.appProvider.saveMetadata(resourceName, resourcesData[resourceName], this.currentUser.currentDatabase).then(() => {
              updateCounts++;

              if (updateCounts == resources.length) {
                this.autoSelect("un-selectAll");
                this.isProcessRunning = false;
                this.appProvider.setNormalNotification("All updates has been applied successfully.");
                this.showLoadingMessage = false;
               }
            }, error => {
              this.isProcessRunning = false;
              this.appProvider.setNormalNotification("Fail to apply updates 0 : " + JSON.stringify(error));
            })
          }

            });

          },
          error => {
            this.appProvider.setNormalNotification("Fail to prepare Database tables");
          }
        );


      }, error => {
        this.isProcessRunning = false;
        this.appProvider.setNormalNotification("Fail to prepare device to apply updates " + JSON.stringify(error));
      });
    }, error => {
      this.isProcessRunning = false;
      this.appProvider.setNormalNotification("Fail to download updates : " + JSON.stringify(error));
    });



  }





}
