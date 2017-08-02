import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpClient} from "./http-client";
import {SqlLite} from "./sql-lite";
import {AppProvider} from "./app-provider";
import {OrganisationUnit} from "./organisation-unit";
import {DataSets} from "./data-sets";

/*
  Generated class for the UpdateResourceManager provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UpdateResourceManager {


  constructor(public HttpClient : HttpClient,
              public OrganisationUnit : OrganisationUnit,
              public DataSets : DataSets,
              public sqlLite : SqlLite,public appProvider : AppProvider) {
  }

  /***
   *
   * @param resources
   * @param currentUser
   * @returns {Promise<T>}
     */
  downloadResources(resources,specialMetadataResources,currentUser){

    let promises = [];
    let data  = {};
    return new Promise((resolve, reject) =>  {
      resources.forEach((resource:any)=>{
        let resourceName = resource.name;
        if(specialMetadataResources.indexOf(resourceName) == -1){
          let fields = this.sqlLite.getDataBaseStructure()[resourceName].fields;
          let filter = this.sqlLite.getDataBaseStructure()[resourceName].filter;
          promises.push(
            this.appProvider.downloadMetadata(currentUser,resourceName,null,fields,filter).then((response : any) =>{
              data[resource.name] = response[resource.name];
            },error=>{})
          );
        }else{
          if(resourceName == "organisationUnits"){
            promises.push(
              this.OrganisationUnit.downloadingOrganisationUnitsFromServer(currentUser.userOrgUnitIds,currentUser).then((orgUnits:any)=>{
                data[resource.name] = orgUnits;
              },error=>{})
            );

          }else if(resourceName == "dataSets"){
            promises.push(
              this.DataSets.downloadDataSetsFromServer(currentUser).then((dataSets : any)=>{
                data[resource.name] = dataSets;
              },error=>{})
            );
          }
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
