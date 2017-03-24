import { Component,OnInit } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {SqlLite} from "../../providers/sql-lite";

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit{

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public profileInformation : any = [];
  public userRoles : any = [];
  public assignedForms : any = [];
  public assignedPrograms : any = [];
  public assignOrgUnits : any = [];
  public hideAndShowObject : any = {
    profileInformation : { status : false,count : 4 },
    assignOrgUnits : { status : false,count : 4 },
    userRoles : { status : false,count : 4},
    assignedPrograms : { status : false,count : 4 },
    assignedForms :{ status : false,count : 4 }
  };

  constructor(public toastCtrl: ToastController,public user : User,public sqlLite : SqlLite) {}

  ngOnInit() {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
      this.loadingProfileInformation();
    });
  }

  loadingProfileInformation(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading profiles information');
    this.user.getUserData().then((userData :any)=>{
      let data = {};
      for(let key in userData){
        let value = userData[key];
        if(!(value instanceof Object)){
          data[key] = value
        }
      }
      this.profileInformation = this.getArrayFromObject(data);
      this.setUserRoles(userData);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load profile information');
    });
  }

  setUserRoles(userData){
    this.setLoadingMessages('Loading user roles');
    this.userRoles = [];
    this.assignedForms = [];
    this.assignedPrograms = [];
    userData.userRoles.forEach((userRole:any)=>{
      this.userRoles.push(userRole.name);
      this.setAssignedForms(userRole.dataSets);
      this.setAssignedPrograms(userRole.programs);
    });
    this.loadingAssignedOrganisationUnits(userData.organisationUnits);
  }

  setAssignedForms(dataSets){
    dataSets.forEach((dataSet:any)=>{
      if(this.assignedForms.indexOf(dataSet.name) == -1){
        this.assignedForms.push(dataSet.name);
      }
    });
  }

  setAssignedPrograms(programs){
    programs.forEach((program:any)=>{
      if(this.assignedPrograms.indexOf(program.name) == -1){
        this.assignedPrograms.push(program.name);
      }
    });
  }

  loadingAssignedOrganisationUnits(organisationUnits){
    this.setLoadingMessages('Loading assigned organisation units');
    this.assignOrgUnits = [];
    let resource = 'organisationUnits';
    let attribute = 'id';
    let attributeValue =[];
    organisationUnits.forEach((organisationUnit:any)=>{
      attributeValue.push(organisationUnit.id);
    });
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((assignedOrganisationUnits:any)=>{
      assignedOrganisationUnits.forEach((assignedOrganisationUnit : any)=>{
        this.assignOrgUnits.push(assignedOrganisationUnit.name);
      });
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load assigned organisation units');
    });
  }

  getArrayFromObject(object){
    let array = [];
    for(let key in object){
      let newValue = object[key];
      if(newValue instanceof Object) {
        newValue = JSON.stringify(newValue)
      }
      let newKey = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
      array.push({key : newKey,value : newValue})
    }
    return array;
  }

  hideAndShowDetails(key,totalCount){
    if(this.hideAndShowObject[key].status){
      this.hideAndShowObject[key].count = 4;
    }else{
      this.hideAndShowObject[key].count = totalCount;
    }
    this.hideAndShowObject[key].status = !this.hideAndShowObject[key].status;
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
