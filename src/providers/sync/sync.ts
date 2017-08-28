import { Injectable } from '@angular/core';
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from "rxjs/Observable";
import {DataSetsProvider} from "../data-sets/data-sets";
import {OrganisationUnitsProvider} from "../organisation-units/organisation-units";
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {AppProvider} from "../app/app";

/*
  Generated class for the SyncProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SyncProvider {

  constructor(private HttpClient : HttpClientProvider,  private sqLite: SqlLiteProvider,  private appProvider: AppProvider,
              private orgUnitsProvider: OrganisationUnitsProvider, private datasetsProvider: DataSetsProvider) {}

  getSyncContentDetails(){
    let syncContents = [
      {id : 'dataViaSms',name : 'Upload data via sms',icon: 'assets/sync-icons/sms.png'},
      {id : 'dataViaInternet',name : 'Upload data via internet',icon: 'assets/sync-icons/internet.png'},
      {id : 'downloadMetadata',name : 'Download metadata',icon: 'assets/sync-icons/download-metadata.png'},
      {id : 'downloadData',name : 'Download data',icon: 'assets/sync-icons/download-data.png'},
      {id : 'clearData',name : 'Clear local data',icon: 'assets/sync-icons/clear-data.png'},
      {id : 'clearMetadata',name : 'Clear local metadata',icon: 'assets/sync-icons/clear-metadata.png'},
    ];
    return syncContents;
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
          let fields = this.sqLite.getDataBaseStructure()[resourceName].fields;
          let filter = this.sqLite.getDataBaseStructure()[resourceName].filter;
          promises.push(
            this.appProvider.downloadMetadata(currentUser,resourceName,null,fields,filter).then((response : any) =>{
              data[resource.name] = response[resource.name];
            },error=>{})
          );

          this.appProvider.setNormalNotification("downloadResource")
        }else{
          if(resourceName == "organisationUnits"){
            promises.push(
              this.orgUnitsProvider.downloadingOrganisationUnitsFromServer(currentUser.userOrgUnitIds,currentUser).then((orgUnits:any)=>{
                data[resource.name] = orgUnits;
              },error=>{})
            );

          }else if(resourceName == "dataSets"){
            promises.push(
              this.datasetsProvider.downloadDataSetsFromServer(currentUser).then((dataSets : any)=>{
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
          this.sqLite.deleteAllOnTable(resource.name,currentUser.currentDatabase).then(()=>{
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
