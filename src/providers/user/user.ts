import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { HTTP } from '@ionic-native/http';

/*
 Generated class for the UserProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class UserProvider {

  public userData : any;

  constructor(public storage : Storage,public http: HTTP) {

  }

  /**
   *
   * @param user
   * @returns {Promise<T>}
   */
  getUserDataFromServer(user){

    this.http.useBasicAuth(user.username, user.password);
    let fields = "fields=[:all],organisationUnits[id,name],dataViewOrganisationUnits[id,name],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
    let url = user.serverUrl.split("/dhis-web-commons")[0];
    url = url.split("/dhis-web-dashboard-integration")[0];
    url = url.split("/api/apps")[0];
    user.serverUrl = url;
    url += "/api/me.json?" + fields;

    return new Promise((resolve, reject)=> {
      this.http.get(url, {}, {})
        .then((data:any)  => {
          if(data.data.indexOf('login.action') > -1){
            user.serverUrl = user.serverUrl.replace('http://','https://');
            this.getUserDataFromServer(user).then((data:any) => {
              let url = user.serverUrl.split("/dhis-web-commons")[0];
              url = url.split("/dhis-web-dashboard-integration")[0];
              user.serverUrl = url;
              resolve({data : data.data,user : user});
            })
              .catch(error => {
                reject(error);
              });
          }else{
            resolve({data : data.data,user : user});
          }
        },error=>{
          reject(error);
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
  getUserAuthorities(user){
    this.http.useBasicAuth(user.username, user.password);
    let fields = "fields=authorities";
    let url = user.serverUrl;
    url += "/api/me.json?" + fields;
    if(user.dhisVersion &&(parseInt(user.dhisVersion) > 25)){
      url = url.replace("/api","/api/" + user.dhisVersion);
    }
    return new Promise((resolve, reject)=> {
      this.http.get(url, {}, {})
        .then((response:any)  => {
          resolve(JSON.parse(response.data));
        },error=>{
          reject(error);
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
    this.http.useBasicAuth(user.username, user.password);
    return new Promise((resolve, reject)=> {
      this.http.get(user.serverUrl + "", {}, {})
        .then((data:any)  => {
          console.log("On success call");
          if(data.status == 200){
            if(data.headers && data.headers["Set-Cookie"]){
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
            }
            this.getUserDataFromServer(user).then((data:any) => {
              let url = user.serverUrl.split("/dhis-web-commons")[0];
              url = url.split("/dhis-web-dashboard-integration")[0];
              user.serverUrl = url;
              resolve({data : data.data,user : data.user});
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
            if(error.headers && error.headers.Location){
              user.serverUrl = error.headers.Location;
              this.authenticateUser(user).then((data:any) => {
                let url = user.serverUrl.split("/dhis-web-commons")[0];
                url = url.split("/dhis-web-dashboard-integration")[0];
                user.serverUrl = url;
                resolve({data : data,user : user});
              })
                .catch(error => {
                  reject(error);
                });
            }else if(error.headers && error.headers.location){
              user.serverUrl = error.headers.location;
              this.authenticateUser(user).then((data:any) => {
                let url = user.serverUrl.split("/dhis-web-commons")[0];
                url = url.split("/dhis-web-dashboard-integration")[0];
                user.serverUrl = url;
                resolve({data : data,user : user});
              })
                .catch(error => {
                  reject(error);
                });
            }else{
              reject(error);
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
    user = JSON.stringify(user);
    return  new Promise((resolve,reject) => {
      this.storage.set('user', user).then(() => {
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
    let dhisVersion = "22";
    if(systemInformation.version){
      let versionArray = systemInformation.version.split(".");
      dhisVersion = (versionArray.length > 0) ? versionArray[1] : dhisVersion;
    }

    return  new Promise((resolve,reject) => {
      systemInformation = JSON.stringify(systemInformation);
      this.storage.set('systemInformation', systemInformation).then(() => {
        resolve(dhisVersion);
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
      "organisationUnits": userDataResponse.organisationUnits,
      "dataViewOrganisationUnits" : userDataResponse.dataViewOrganisationUnits
    };
    let userData = JSON.stringify(this.userData);
    return  new Promise((resolve,reject) => {
      this.storage.set('userData', userData).then(() => {
        resolve(JSON.parse(userData));
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
    return  new Promise((resolve,reject) => {
      this.storage.get('userData').then(userData=>{
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
    return  new Promise((resolve,reject) => {
      this.storage.get('systemInformation').then(systemInformation=>{
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
    return  new Promise((resolve,reject) => {
      this.storage.get('user').then(user=>{
        user = JSON.parse(user);
        resolve(user);
      },err=>{
        reject();
      })
    })
  }
}
