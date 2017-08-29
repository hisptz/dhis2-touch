import { Injectable } from '@angular/core';
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from "rxjs/Observable";
import {DataSetsProvider} from "../data-sets/data-sets";
import {OrganisationUnitsProvider} from "../organisation-units/organisation-units";
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {AppProvider} from "../app/app";
import {SectionsProvider} from "../sections/sections";
import {DataElementsProvider} from "../data-elements/data-elements";
import {SmsCommandProvider} from "../sms-command/sms-command";
import {IndicatorsProvider} from "../indicators/indicators";
import {reject} from "q";

/*
  Generated class for the SyncProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SyncProvider {

  constructor(private HttpClient : HttpClientProvider,  private sqLite: SqlLiteProvider,  private appProvider: AppProvider,
              private orgUnitsProvider: OrganisationUnitsProvider, private datasetsProvider: DataSetsProvider,
              private sectionProvider: SectionsProvider, private dataElementProvider: DataElementsProvider,
              private smsCommandsProvider: SmsCommandProvider, private indicatorProvider: IndicatorsProvider) {}

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

          promises.push(
            this.appProvider.downloadMetadata(currentUser,resourceName,null).then((response : any) =>{
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


  universalDownloadResources(resources,specialMetadataResources,currentUser){
    let promises = [];
    let data  = {};
    let resourceName = resources.name;

    return new Promise((resolve, reject) => {
      resources.forEach((resource: any) => {

        this.appProvider.setNormalNotification("Universal Download is On");
        console.log("OrgUnitIds: "+JSON.stringify(currentUser));

        if (resourceName == "organisationUnits") {
          this.appProvider.setNormalNotification("Universal Downloading OrgUnit...");

          promises.push(

            this.orgUnitsProvider.getOrganisationUnitsByIds(currentUser.userOrgUnitIds, currentUser).then((response: any) => {
            //this.appProvider.downloadMetadata( currentUser, resourceName, currentUser.userOrgUnitIds).then((response: any) => {
              data[resource.name] = response[resource.name];
              this.appProvider.saveMetadata(resourceName,data[resourceName],currentUser.currentDatabase);
              this.appProvider.setNormalNotification("Universal Downloading OrgUnit...");

              //this.appProvider.setNormalNotification("Universal Downloading OrgUnit...");
              this.orgUnitsProvider.savingOrganisationUnitsFromServer(response, currentUser)
              console.log("Orgunits Downloaded & saved");
            }, error => {
            })
          );

        } else if (resourceName == "dataSets") {
          promises.push(
            this.datasetsProvider.downloadDataSetsFromServer(currentUser).then((response: any) => {
              data[resource.name] = response[resource.name];
              this.datasetsProvider.saveDataSetsFromServer(response, currentUser)
            }, error => {
            })
          );
        } else if (resourceName == "sections") {
          promises.push(
            this.sectionProvider.downloadSectionsFromServer(currentUser).then((response: any) => {
              data[resource.name] = response[resource.name];
              this.sectionProvider.saveSectionsFromServer(response[resource], currentUser)
            }, error => {
            })
          );
        } else if (resourceName == "dataElements") {
          promises.push(
            this.dataElementProvider.downloadDataElementsFromServer(currentUser).then((response: any) => {
              data[resource.name] = response[resource.name];
              this.dataElementProvider.saveDataElementsFromServer(response[resource], currentUser)
            }, error => {
            })
          );
        } else if (resourceName == "smsCommand") {
          promises.push(
            this.smsCommandsProvider.getSmsCommandFromServer(currentUser).then((response: any) => {
              data[resource.name] = response[resource.name];
              this.smsCommandsProvider.savingSmsCommand(response, currentUser.currentDatabase)
            }, error => {
            })
          );
        } else if (resourceName == "indicators") {
          promises.push(
            this.indicatorProvider.downloadingIndicatorsFromServer(currentUser).then((response: any) => {
              data[resource.name] = response[resource.name];
              this.indicatorProvider.savingIndicatorsFromServer(response[resource], currentUser)
            }, error => {
            })
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



}
