import { Component,OnInit } from '@angular/core';
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
export class UpdateManagerHome implements OnInit{

  public dataBaseStructure :  any;
  public resources : any;
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public hasAllSelected : boolean;
  public hasSelectedResourceUpdated : boolean = false;

  public updateManagerObject : any = {
    updateMetadata : {isExpanded : false,isSaved : true},
    sendDataViaSms : {isExpanded : true,isSaved : true}
  };

  constructor(public navCtrl: NavController,public sqlLite : SqlLite,
              public user : User,public toastCtrl: ToastController,
              public appProvider : AppProvider,public updateResourceManager : UpdateResourceManager,
              public httpClient : HttpClient) {

  }

  ngOnInit() {
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
      if(this.dataBaseStructure[resource].canBeUpdated && this.dataBaseStructure[resource].fields !=""){
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
      this.setLoadingMessages("Preparing device to apply updates");
      this.updateResourceManager.prepareDeviceToApplyChanges(resources,this.currentUser).then(()=>{
        let updateCounts = 0;
        this.setLoadingMessages("Applying update " + this.getPercentage(updateCounts,resources.length) + " %");
        resources.forEach((resource:any)=>{
          let resourceName = resource.name;
          this.appProvider.saveMetadata(resourceName,resourcesData[resourceName],this.currentUser.currentDatabase).then((
          )=>{
            updateCounts ++;
            this.loadingMessages[2] = "Applying update " + this.getPercentage(updateCounts,resources.length) + " %";
            if(updateCounts == resources.length){
              this.loadingData = false;
              this.autoSelect("un-selectAll");
              this.setToasterMessage("All updates has been applied successfully");
            }
          },error=>{
            this.loadingData = false;
            this.setToasterMessage("Fail to apply updates : " + JSON.stringify(error));
          })
        });
      },error=>{
        this.loadingData = false;
        this.setToasterMessage("Fail to prepare device to apply updates " + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to download updates : " + JSON.stringify(error));
    });
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
