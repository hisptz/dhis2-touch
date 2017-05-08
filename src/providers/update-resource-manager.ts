import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpClient} from "./http-client";
import {SqlLite} from "./sql-lite";
import {AppProvider} from "./app-provider";

/*
  Generated class for the UpdateResourceManager provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UpdateResourceManager {


  constructor(public HttpClient : HttpClient,public sqlLite : SqlLite,public appProvider : AppProvider) {
  }

  /***
   *
   * @param resources
   * @param currentUser
   * @returns {Promise<T>}
     */
  downloadResources(resources,currentUser){

    let promises = [];
    let data  = {};
    return new Promise((resolve, reject) =>  {
      resources.forEach((resource:any)=>{
        let resourceName = resource.name;
        let fields = this.sqlLite.getDataBaseStructure()[resourceName].fields;
        let filter = this.sqlLite.getDataBaseStructure()[resourceName].filter;
        if(resourceName != "organisationUnits"){
          promises.push(
            this.appProvider.downloadMetadata(currentUser,resourceName,null,fields,filter).then((response : any) =>{
              data[resource.name] = response[resource.name];
            },error=>{})
          );
        }else{
          let orgUnitIds = [];
          currentUser["organisationUnits"].forEach((orgUnit:any)=>{
            orgUnitIds.push(orgUnit.id);
          });
          promises.push(
            this.appProvider.downloadMetadataByResourceIds(currentUser,resourceName,orgUnitIds,fields,filter).then((response : any) =>{
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

  prepareDeviceToApplyChanges(resources,currentUser){

    let promises = [];
    return new Promise((resolve, reject) =>  {
      resources.forEach((resource:any)=>{
        promises.push(
          this.sqlLite.deleteAllOnTable(resource.name,currentUser.currentDatabase).then(()=>{
          },error=>{

          })
        )
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve();
        },
        (error) => {
          reject(error);
        })
    });

  }



  savingResources(resources,data,currentUser){

    let promises = [];

    return new Promise((resolve, reject) =>  {
      resources.forEach((resource:any)=>{
        let resourceName = resource.name;
        if(data[resourceName]){
          promises.push(
            this.appProvider.saveMetadata(resourceName,data[resourceName],currentUser.currentDatabase).then((
            )=>{
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
