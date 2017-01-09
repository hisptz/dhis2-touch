import { Component } from '@angular/core';
import {ToastController,NavController } from 'ionic-angular';

import {User} from '../../providers/user/user';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {AppProvider} from "../../providers/app-provider/app-provider";
import {UpdateResourceManager} from "../../providers/update-resource-manager";
/*
  Generated class for the UpdateManagerHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-update-manager-home',
  templateUrl: 'update-manager-home.html',
  providers : [User,HttpClient,SqlLite,AppProvider,UpdateResourceManager]
})
export class UpdateManagerHome {

  public dataBaseStructure :  any;
  public resources : any;
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public hasAllSelected : boolean;
  public hasSelectedResourceUpdated : boolean = false;

  constructor(public navCtrl: NavController,public sqlLite : SqlLite,
              public user : User,public toastCtrl: ToastController,
              public appProvider : AppProvider,public updateResourceManager : UpdateResourceManager,
              public httpClient : HttpClient) {


    this.hasAllSelected = false;
    this.loadingData = true;
    this.loadingMessages = [];
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

  ionViewDidLoad() {
  }

  setUpdateManagerList(){
    this.resources = [];
    this.dataBaseStructure = this.sqlLite.getDataBaseStructure();
    Object.keys(this.dataBaseStructure).forEach((resource:any)=>{
      if(this.dataBaseStructure[resource].canBeUpdated){
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
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Downloading updates");
    this.updateResourceManager.downloadResources(resources,this.currentUser).then((resourcesData)=>{
      this.setLoadingMessages("Applying updates");
      this.updateResourceManager.savingResources(resources,resourcesData,this.currentUser).then(()=>{
        this.loadingData = false;
      },error=>{
        this.loadingData = false;
        this.setToasterMessage("Fail to apply updates : " + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to download updates : " + JSON.stringify(error));
    });
  }

  updateResourcessds(resources){
    //hasSelectedResourceUpdated
    let numberOfDownload : number = 0;
    let numberOfUpdateResources : number = 0;
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Download percent : 0 %");
    this.setLoadingMessages("Update percent : 0 %" );
    for(let resource of resources){
      let resourceName = resource.name;
      let fields = this.dataBaseStructure[resourceName].fields;
      let filter = this.dataBaseStructure[resourceName].filter;
      if(resourceName != "organisationUnits"){
        this.setLoadingMessages("Downloading " + resource.displayName);
        this.appProvider.downloadMetadata(this.currentUser,resourceName,null,fields,filter).then((response : any) =>{
          numberOfDownload ++;
          this.loadingMessages[0] = "Download percent : " +this.getPercentage(numberOfDownload,resources.length)+" %";
          this.setLoadingMessages("Updating " + resource.displayName);
          this.appProvider.saveMetadata(resourceName,response[resourceName],this.currentUser.currentDatabase).then(()=>{
            numberOfUpdateResources ++;
            this.loadingMessages[1] = "Update percent : " +this.getPercentage(numberOfUpdateResources,resources.length)+" %";
            if(numberOfUpdateResources == resources.length){
              this.hasSelectedResourceUpdated = true;
              this.loadingData = false;
            }
          },error=>{
            this.setToasterMessage("Fail to update " + resource.displayName + " : " + JSON.stringify(error));
          })
        },error=>{
          this.loadingData = false;
          this.setToasterMessage("Fail to download " + resource.displayName + " : " + JSON.stringify(error));
        })
      }else{
        let orgUnitIds = [];
        this.currentUser["organisationUnits"].forEach((orgUnit:any)=>{
          orgUnitIds.push(orgUnit.id);
        });
        this.setLoadingMessages("Downloading " + resource.displayName);
        this.appProvider.downloadMetadataByResourceIds(this.currentUser,resourceName,orgUnitIds,fields,filter).then((response : any) =>{
          numberOfDownload ++;
          this.loadingMessages[0] = "Download percent : " +this.getPercentage(numberOfDownload,resources.length)+" %";
          this.setLoadingMessages("Updating " + resource.displayName);
          this.appProvider.saveMetadata(resourceName,response,this.currentUser.currentDatabase).then(()=>{
            numberOfUpdateResources ++;
            this.loadingMessages[1] = "Update percent : " +this.getPercentage(numberOfUpdateResources,resources.length)+" %";
            if(numberOfUpdateResources == resources.length){
              this.hasSelectedResourceUpdated = true;
              this.loadingData = false;
            }
          },error=>{
            this.setToasterMessage("Fail to update " + resource.displayName + " : " + JSON.stringify(error));
          })
        },error=>{
          this.loadingData = false;
          this.setToasterMessage("Fail to download " + resource.displayName + " : " + JSON.stringify(error));
        })
      }
    }
  }

  getPercentage(numerator : number,denominator : number){
    let fraction : number;
    fraction = (numerator/denominator) *100;
    return fraction.toFixed(2)
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


  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
