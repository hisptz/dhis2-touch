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
import {StandardReportProvider} from "../standard-report/standard-report";
import {ProgramsProvider} from "../programs/programs";
import {ProgramStageSectionsProvider} from "../program-stage-sections/program-stage-sections";
import {DataValuesProvider} from "../data-values/data-values";

/*
  Generated class for the SyncProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SyncProvider {

  constructor(private sqLite: SqlLiteProvider,
              private dataValuesProvider : DataValuesProvider,
              private orgUnitsProvider: OrganisationUnitsProvider, private dataSetsProvider: DataSetsProvider,
              private sectionProvider: SectionsProvider, private dataElementProvider: DataElementsProvider,
              private smsCommandsProvider: SmsCommandProvider, private indicatorProvider: IndicatorsProvider,
              private reportsProvider: StandardReportProvider, private programProvider: ProgramsProvider,
              private programStageSectionsProvider: ProgramStageSectionsProvider) {}

  getSyncContentDetails(){
    let syncContents = [
      {id : 'dataViaSms',name : 'upload_data_via_sms',icon: 'assets/icon/sms.png'},
      {id : 'dataViaInternet',name : 'upload_data_via_internet',icon: 'assets/icon/internet.png'},
      {id : 'downloadMetadata',name : 'download_metadata',icon: 'assets/icon/download-metadata.png'},
      //{id : 'downloadData',name : 'download_data',icon: 'assets/icon/download-data.png'},
      {id : 'clearData',name : 'clear_local_data',icon: 'assets/icon/clear-data.png'},
      {id : 'clearMetadata',name : 'clear_local_metadata',icon: 'assets/icon/clear-metadata.png'},
    ];
    return syncContents;
  }


  getDownloadDataDetails(){
    let downloadContents = [
      {id : 'dataValues',name : 'data_values',icon: 'assets/icon/download-data.png'},
      {id : 'events',name : 'events',icon: 'assets/icon/download-events.png'},

    ];
    return downloadContents;
  }

  /**
   *
   * @param {Array<string>} itemsToUpload
   */
  getDataForUploading(itemsToUpload : Array<string>,currentUser : any){
    let promises = [];
    let data = {};
    let status = "not-synced";
    return new Promise((resolve, reject) =>  {
      //@todo implementing events downloading
      if(!itemsToUpload || (itemsToUpload.length == 1 && itemsToUpload.indexOf("events") > -1)){
        resolve(data);
      }else{
        itemsToUpload.forEach((item : string)=>{
          if(item == "dataValues"){
            promises.push(
              this.dataValuesProvider.getDataValuesByStatus(status,currentUser).then((dataValues : Array<any>)=>{
                data[item] = dataValues;
              },error=>{})
            )
          }else if(item == "events"){
            data[item] = [];
          }else if(item){

          }
        });
        Observable.forkJoin(promises).subscribe(() => {
            resolve(data);
          },
          (error) => {
            reject(error);
          })
      }
    });
  }

  /**
   *
   * @param data
   * @returns {Promise<any>}
   */
  prepareDataForUploading(data : any){
    let preparedData = {};
    return new Promise((resolve, reject) =>  {
      try{
        Object.keys(data).forEach((item : string)=>{
          if(item == "dataValues"){
            preparedData[item] = this.dataValuesProvider.getFormattedDataValueForUpload(data[item]);
          }else if(item == "events"){
            preparedData[item] = [];
          }
        });
        resolve(preparedData);
      }catch (error){
        reject(error);
      }
    });
  }

  uploadingData(formattedDataObject,dataObject,currentUser){
    let promises = [];
    let response = {};
    let status = "not-synced";
    return new Promise((resolve, reject) =>  {
      Object.keys(dataObject).forEach((item : string)=>{
        if(item == "dataValues"){
          promises.push(
            this.dataValuesProvider.uploadDataValues(formattedDataObject[item],dataObject[item],currentUser).then((importSummaries)=>{
              response[item] = importSummaries;
            },error=>{})
          )
        }else if(item == "events"){

        }
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve(response);
        },
        (error) => {
          reject(error);
        })
    });
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
        if(resource == "organisationUnits"){
          promises.push(
            this.orgUnitsProvider.downloadingOrganisationUnitsFromServer(currentUser.userOrgUnitIds, currentUser).then((response: any) => {
              data[resource] = response;

            }, error => {
            })
          );
        }else if(resource == "dataSets"){
          promises.push(
            this.dataSetsProvider.downloadDataSetsFromServer(currentUser).then((response: any) => {
              data[resource] = response;
            }, error => {
            })
          );
        }else if(resource == "sections"){
          promises.push(
            this.sectionProvider.downloadSectionsFromServer(currentUser).then((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        }else if(resource == "dataElements"){
          promises.push(
            this.dataElementProvider.downloadDataElementsFromServer(currentUser).then((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        }else if(resource == "indicators"){
          promises.push(
            this.indicatorProvider.downloadingIndicatorsFromServer(currentUser).then((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        }else if(resource == "smsCommand"){
          promises.push(
            this.smsCommandsProvider.getSmsCommandFromServer(currentUser).then((response: any) => {
             data[resource] = response;
            }, error => {
            })
          );
        }else if(resource == "reports"){
          promises.push(
            this.reportsProvider.downloadReportsFromServer(currentUser).then((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        }else if(resource == "constants"){
          promises.push(
            this.reportsProvider.downloadConstantsFromServer(currentUser).then((response: any) => {
              data[resource] = response[resource];
            }, error => {})
          );
        } else if(resource == "programs"){
          promises.push(
             this.programProvider.downloadProgramsFromServer(currentUser).then((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        } else if(resource == "programStageSections"){
          promises.push(
            this.programStageSectionsProvider.downloadProgramsStageSectionsFromServer(currentUser).then((response: any) => {
              data[resource] = response[resource];;
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

  /**
   *
   * @param resources
   * @param data
   * @param currentUser
   * @returns {Promise<any>}
   */
  savingResources(resources,data,currentUser){
    let promises = [];
    return new Promise((resolve, reject) =>  {
      resources.forEach((resource:any)=>{
        if(resource == "organisationUnits"){
          promises.push(
            this.orgUnitsProvider.savingOrganisationUnitsFromServer(data[resource],currentUser).then(()=>{},error=>{})
          );
        }else if(resource == "dataSets"){
          promises.push(
            this.dataSetsProvider.saveDataSetsFromServer(data[resource],currentUser).then(() => {}, error => {})
          );
        }else if(resource == "sections"){
          promises.push(
            this.sectionProvider.saveSectionsFromServer(data[resource],currentUser).then(() => {}, error => {})
          );
        }else if(resource == "dataElements"){
          promises.push(
            this.dataElementProvider.saveDataElementsFromServer(data[resource],currentUser).then(() => {}, error => {})
          );
        }else if(resource == "indicators"){
          promises.push(
            this.indicatorProvider.savingIndicatorsFromServer(data[resource],currentUser).then(() => {}, error => {})
          );
        }else if(resource == "smsCommand"){
          promises.push(
            this.smsCommandsProvider.savingSmsCommand(data[resource],currentUser).then(() => {}, error => {})
          );
        }else if(resource == "reports"){
          promises.push(
            this.reportsProvider.saveReportsFromServer(data[resource],currentUser).then(() => {}, error => {})
          );
        }else if(resource == "constants"){
          promises.push(
            this.reportsProvider.saveConstantsFromServer(data[resource],currentUser).then(() => {}, error => {})
          );
        }else if(resource == "programs"){
          promises.push(
            this.programProvider.saveProgramsFromServer(data[resource],currentUser).then(() => {}, error => {})
          );
        }else if(resource == "programStageSections"){
          promises.push(
            this.programStageSectionsProvider.saveProgramsStageSectionsFromServer(data[resource],currentUser).then(() => {}, error => {})
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

  /**
   *
   * @param resources
   * @param currentUser
   * @returns {Promise<any>}
   */
  prepareTablesToApplyChanges(resources,currentUser){
    let promises = [];
    return new Promise((resolve, reject) =>  {
       resources.forEach((resource:any)=>{
        promises.push(
          this.sqLite.dropTable(resource,currentUser.currentDatabase).then(()=>{
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

}
