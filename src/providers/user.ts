import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { HTTP } from '@ionic-native/http';

/*
 Generated class for the User provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class User {

  public userData : any;

  constructor(public storage : Storage,public http: HTTP) {

  }

  /**
   *
   * @param user
   * @returns {Promise<T>}
     */
  getUserDataFromServer(user){
    let self = this;
    self.http.useBasicAuth(user.username, user.password);
    let fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
    let url = user.serverUrl.split("/dhis-web-commons")[0];
    url = url.split("/dhis-web-dashboard-integration")[0];
    user.serverUrl = url;
    url += "/api/25/me.json?" + fields;

    return new Promise(function(resolve, reject) {
      self.http.get(url, {}, {})
        .then((data:any)  => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   *
   * @param user
   * @returns {Promise<T>}
     */
  authenticateUser(user){
    let self = this;
    self.http.useBasicAuth(user.username, user.password);

    return new Promise(function(resolve, reject) {
      self.http.get(user.serverUrl + "", {}, {})
        .then((data:any)  => {
          if(data.status == 200){
            let setCookieArray = data.headers["Set-Cookie"].split(";");
            let path = "";let url = "";
            let serverUrlArray = user.serverUrl.split("/");
            setCookieArray.forEach((value : any)=>{
              if(value.indexOf("Path=/") > -1){
                let pathValues = value.split("Path=/");
                path = pathValues[pathValues.length -1].split("/")[0];
              }
            });
            if(serverUrlArray[serverUrlArray.length -1] != path){
              url = (serverUrlArray[serverUrlArray.length -1] == "")? user.serverUrl + path : user.serverUrl + "/"+ path;
            }else{
              url = user.serverUrl;
            }
            user.serverUrl = url;
            self.getUserDataFromServer(user).then((data:any) => {
                let url = user.serverUrl.split("/dhis-web-commons")[0];
                url = url.split("/dhis-web-dashboard-integration")[0];
                user.serverUrl = url;
                resolve({data : data.data,user : user});
              })
              .catch(error => {
                reject(error);
              });
          }else{
            reject(data);
          }
        })
        .catch(error => {
          if(error.status == 301 || error.status == 302){
            if(error.headers.Location){
              user.serverUrl = error.headers.Location;
              self.authenticateUser(user).then((data:any) => {
                  let url = user.serverUrl.split("/dhis-web-commons")[0];
                  url = url.split("/dhis-web-dashboard-integration")[0];
                  user.serverUrl = url;
                  resolve({data : data,user : user});
                })
                .catch(error => {
                  reject(error);
                });
            }
          }else{
            reject(error);
          }
        });
    });
  }

  /**
   *
   * @param user
   * @returns {Promise<T>}
     */
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

  /**
   *
   * @param systemInformation
   * @returns {Promise<T>}
     */
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

  /**
   *
   * @param userDataResponse
   * @returns {Promise<T>}
     */
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

  /**
   *
   * @returns {Promise<T>}
     */
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

  /**
   *
   * @returns {Promise<T>}
     */
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

  /**
   *
   * @returns {Promise<T>}
     */
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

