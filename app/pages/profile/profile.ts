import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import {ObjectToArray} from '../../pipes/objectToArray';
import {User} from '../../providers/user/user';
import {AppProvider} from '../../providers/app-provider/app-provider';
import {HttpClient} from "../../providers/http-client/http-client";
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
 Generated class for the ProfilePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  templateUrl: 'build/pages/profile/profile.html',
  providers : [User,AppProvider,HttpClient,SqlLite],
  pipes : [ObjectToArray]
})
export class ProfilePage {

  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private currentUser : any;
  private profileInformation : any;
  private userRoles : any;
  private assignedForms : any;
  private assignedPrograms : any;
  private assignOrgUnits : any;

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private user : User,private appProvider : AppProvider,private sqlLite : SqlLite,private httpClient: HttpClient) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = currentUser;
    });
    this.loadingProfileInformation();
  }

  loadingProfileInformation(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.profileInformation = {};
    this.setLoadingMessages('Loading profiles information');
    this.user.getUserData().then((userData :any)=>{
      for(let key in userData){
        let value = userData[key];
        if(!(value instanceof Object)){
          this.profileInformation[key] = value
        }
      }
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

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }

}
