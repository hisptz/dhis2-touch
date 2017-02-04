import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import {HttpClient} from "../http-client/http-client";

/*
  Generated class for the User provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class User {

  public userData : any;

  constructor(public storage : Storage,public httpClient : HttpClient) {

  }

  authenticateUser(user){
    let fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
    let self = this;
    return  new Promise(function(resolve,reject){
      self.httpClient.get('/api/me.json?'+fields,user).subscribe(
        data => {
          resolve(data.json());
        },error=>{
          reject(error.json());
        }
      )
    });
  }

  setCurrentUser(user : any){
    let self = this;
    user = JSON.stringify(user);
    return  new Promise(function(resolve,reject){

      self.storage.set('user', user).then(() => {
        resolve();
      },error=>{
        reject();
      });
    });
  }

  setCurrentUserSystemInformation(systemInformation : any){
    let self = this;
    return  new Promise(function(resolve,reject){
      systemInformation = JSON.stringify(systemInformation);
      self.storage.set('systemInformation', systemInformation).then(() => {
        resolve();
      },error=>{
        reject();
      });
    });
  }

  setUserData(userDataResponse){
    this.userData = {};
    this.userData ={
      "Name": userDataResponse.name,
      "Employer": userDataResponse.employer,
      "Job Title": userDataResponse.jobTitle,
      "Education": userDataResponse.education,
      "Gender": userDataResponse.gender,
      "Birthday": userDataResponse.birthday,
      "Nationality": userDataResponse.nationality,
      "Interests": userDataResponse.interests,
      "userRoles": userDataResponse.userCredentials.userRoles,
      "organisationUnits": userDataResponse.organisationUnits
    };
    let userData = JSON.stringify(this.userData);
    let self = this;
    return  new Promise(function(resolve,reject){
      self.storage.set('userData', userData).then(() => {
        resolve(self.userData);
      },error=>{
        reject();
      });
    });
  }

  getUserData(){
    let self = this;
    return  new Promise(function(resolve,reject){
      self.storage.get('userData').then(userData=>{
        userData = JSON.parse(userData);
        resolve(userData);
      },err=>{
        reject();
      }).catch(err=>{
        reject();
      })
    });
  }

  getCurrentUserSystemInformation(){
    let self = this;
    return  new Promise(function(resolve,reject){
      self.storage.get('systemInformation').then(systemInformation=>{
        systemInformation = JSON.parse(systemInformation);
        resolve(systemInformation);
      },err=>{
        reject();
      }).catch(err=>{
        reject();
      })
    });
  }

  getCurrentUser(){
    let self = this;
    return  new Promise(function(resolve,reject){
      self.storage.get('user').then(user=>{
        user = JSON.parse(user);
        resolve(user);
      },err=>{
        reject();
      })
    })
  }

}

