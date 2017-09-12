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
import {StandardReportProvider} from "../standard-report/standard-report";

/*
  Generated class for the SyncProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SyncProvider {

  // currentUser: any;

  constructor(private HttpClient : HttpClientProvider,  private sqLite: SqlLiteProvider,  private appProvider: AppProvider,
              private orgUnitsProvider: OrganisationUnitsProvider, private datasetsProvider: DataSetsProvider,
              private sectionProvider: SectionsProvider, private dataElementProvider: DataElementsProvider,
              private smsCommandsProvider: SmsCommandProvider, private indicatorProvider: IndicatorsProvider,
              private reportsProvider: StandardReportProvider) {}

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

  getDownloadDataDetails(){
    let downloadContents = [
      {id : 'dataValues',name : 'Data values',icon: 'assets/download-data/download-data.png'},
      {id : 'events',name : 'Events',icon: 'assets/download-data/download-events.png'},

    ];
    return downloadContents;
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
        if(resource == "organisationUnits"){
          promises.push(
            this.orgUnitsProvider.downloadingOrganisationUnitsFromServer(currentUser.userOrgUnitIds, currentUser).then((response: any) => {
              data[resource] = response;
              // alert("From OrgUnit Server: "+JSON.stringify(response));
            }, error => {
            })
          );
        }else if(resource == "dataSets"){
          promises.push(
            this.datasetsProvider.downloadDataSetsFromServer(currentUser).then((response: any) => {
              data[resource] = response;
              // alert("From DataSet Server: "+JSON.stringify(response));
            }, error => {
            })
          );
        }else if(resource == "sections"){
          promises.push(
            this.sectionProvider.downloadSectionsFromServer(currentUser).then((response: any) => {
              data[resource] = response;
              // alert("From Sections Server: "+JSON.stringify(response));
            }, error => {
            })
          );
        }else if(resource == "dataElements"){
          promises.push(
            this.dataElementProvider.downloadDataElementsFromServer(currentUser).then((response: any) => {
              data[resource] = response;
              // alert("From DataElement Server: "+JSON.stringify(response));
            }, error => {
            })
          );
        }else if(resource == "indicators"){
          promises.push(
            this.indicatorProvider.downloadingIndicatorsFromServer(currentUser).then((response: any) => {
              data[resource] = response;
             // alert("From Indicator Server: "+JSON.stringify(response));
            }, error => {
            })
          );
        }else if(resource == "smsCommand"){
          promises.push(
            this.smsCommandsProvider.getSmsCommandFromServer(currentUser).then((response: any) => {
             data[resource] = response;
              // alert("From SmsCommand Server: "+JSON.stringify(response));
            }, error => {
            })
          );
        }else if(resource == "reports"){
          promises.push(
            this.reportsProvider.downloadReportsFromServer(currentUser).then((response: any) => {
              data[resource] = response;
              // alert("From Reports Server: "+JSON.stringify(response));
            }, error => {
            })
          );
        }else if(resource == "constants"){

          promises.push(
            this.reportsProvider.downloadConstantsFromServer(currentUser).then((response: any) => {
              data[resource] = response;
              //alert("Back from DownLoad Constants Server: "+JSON.stringify(response));
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


  prepareDeviceToApplyChanges(resources,currentUser){

    let promises = [];
    return new Promise((resolve, reject) =>  {
      resources.forEach((resource:any)=>{

        promises.push(
          this.sqLite.deleteAllOnTable(resource,currentUser.currentDatabase).then(()=>{
            resolve();
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
