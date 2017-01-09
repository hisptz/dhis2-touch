import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {AppProvider} from "./app-provider/app-provider";
import {SqlLite} from "./sql-lite/sql-lite";
import {HttpClient} from "./http-client/http-client";

/*
  Generated class for the UpdateResourceManager provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UpdateResourceManager {

  public dataBaseStructure : any;

  constructor(public HttpClient : HttpClient,public sqlLite : SqlLite,public appProvider : AppProvider) {
    this.dataBaseStructure = this.sqlLite.getDataBaseStructure();
  }

  downloadResources(resources,currentUser){
    let self = this;
    let promises = [];
    let data  = {};
    return new Promise(function(resolve, reject) {
      resources.forEach((resource:any)=>{
        let resourceName = resource.name;
        let fields = self.dataBaseStructure[resourceName].fields;
        let filter = self.dataBaseStructure[resourceName].filter;
        if(resourceName != "organisationUnits"){
          promises.push(
            self.appProvider.downloadMetadata(currentUser,resourceName,null,fields,filter).then((response : any) =>{
              data[resource.name] = response[resource.name];
              //resource["response"] = response;
            },error=>{})
          );
        }else{
          let orgUnitIds = [];
          currentUser["organisationUnits"].forEach((orgUnit:any)=>{
            orgUnitIds.push(orgUnit.id);
          });
          promises.push(
            self.appProvider.downloadMetadataByResourceIds(currentUser,resourceName,orgUnitIds,fields,filter).then((response : any) =>{
              //resource["response"] = response;
              data[resource.name] = response;
            },error=>{})
          );
        }
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve(data);
        },
        (error) => {
          reject(error);
        })
    });
  }

  savingResources(resources,data,currentUser){
    let self = this;
    let promises = [];

    return new Promise(function(resolve, reject) {
      resources.forEach((resource:any)=>{
        let resourceName = resource.name;
        if(data[resourceName]){
          alert("Update : " + resourceName +" : " + data[resourceName].length + "");
          promises.push(
            self.appProvider.saveMetadata(resourceName,data[resourceName],currentUser.currentDatabase).then((
            )=>{
              alert("Success apply "+ resourceName);
            },error=>{})
          );
        }
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve();
        },
        (error) => {
          reject(error);
        })
    });
  }

}
