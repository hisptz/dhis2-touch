import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {DataSetsProvider} from "../data-sets/data-sets";
import {OrganisationUnitsProvider} from "../organisation-units/organisation-units";
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {SectionsProvider} from "../sections/sections";
import {DataElementsProvider} from "../data-elements/data-elements";
import {SmsCommandProvider} from "../sms-command/sms-command";
import {IndicatorsProvider} from "../indicators/indicators";
import {StandardReportProvider} from "../standard-report/standard-report";
import {ProgramsProvider} from "../programs/programs";
import {ProgramStageSectionsProvider} from "../program-stage-sections/program-stage-sections";

/*
  Generated class for the SyncProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SyncProvider {

  constructor(private sqLite: SqlLiteProvider,
              private orgUnitsProvider: OrganisationUnitsProvider, private dataSetsProvider: DataSetsProvider,
              private sectionProvider: SectionsProvider, private dataElementProvider: DataElementsProvider,
              private smsCommandsProvider: SmsCommandProvider, private indicatorProvider: IndicatorsProvider,
              private reportsProvider: StandardReportProvider, private programProvider: ProgramsProvider,
              private programStageSectionsProvider: ProgramStageSectionsProvider) {
  }

  getSyncContentDetails() {
    let syncContents = [
      {id: 'dataViaSms', name: 'upload_data_via_sms', icon: 'assets/icon/sms.png'},
      {id: 'dataViaInternet', name: 'upload_data_via_internet', icon: 'assets/icon/internet.png'},
      {id: 'downloadMetadata', name: 'download_metadata', icon: 'assets/icon/download-metadata.png'},
      //{id : 'downloadData',name : 'download_data',icon: 'assets/icon/download-data.png'},
      {id: 'clearData', name: 'clear_local_data', icon: 'assets/icon/clear-data.png'},
      {id: 'clearMetadata', name: 'clear_local_metadata', icon: 'assets/icon/clear-metadata.png'},
    ];
    return syncContents;
  }

  /**
   *
   * @param resources
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadResources(resources, currentUser): Observable<any> {
    let promises = [];
    let data = {};
    return new Observable(observer => {
      resources.forEach((resource: any) => {
        if (resource == "organisationUnits") {
          promises.push(
            this.orgUnitsProvider.downloadingOrganisationUnitsFromServer(currentUser.userOrgUnitIds, currentUser).subscribe((response: any) => {
              data[resource] = response;
            }, error => {
            })
          );
        } else if (resource == "dataSets") {
          promises.push(
            this.dataSetsProvider.downloadDataSetsFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response;
            }, error => {
            })
          );
        } else if (resource == "sections") {
          promises.push(
            this.sectionProvider.downloadSectionsFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        } else if (resource == "dataElements") {
          promises.push(
            this.dataElementProvider.downloadDataElementsFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        } else if (resource == "indicators") {
          promises.push(
            this.indicatorProvider.downloadingIndicatorsFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        } else if (resource == "smsCommand") {
          promises.push(
            this.smsCommandsProvider.getSmsCommandFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response;
            }, error => {
            })
          );
        } else if (resource == "reports") {
          promises.push(
            this.reportsProvider.downloadReportsFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        } else if (resource == "constants") {
          promises.push(
            this.reportsProvider.downloadConstantsFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        } else if (resource == "programs") {
          promises.push(
            this.programProvider.downloadProgramsFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        } else if (resource == "programStageSections") {
          promises.push(
            this.programStageSectionsProvider.downloadProgramsStageSectionsFromServer(currentUser).subscribe((response: any) => {
              data[resource] = response[resource];
            }, error => {
            })
          );
        }
      });

      Observable.forkJoin(promises).subscribe(() => {
          observer.next(data);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        })
    });
  }

  /**
   *
   * @param resources
   * @param data
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingResources(resources, data, currentUser): Observable<any> {
    let promises = [];
    return new Observable(observer => {
      resources.forEach((resource: any) => {
        if (resource == "organisationUnits") {
          promises.push(
            this.orgUnitsProvider.savingOrganisationUnitsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "dataSets") {
          promises.push(
            this.dataSetsProvider.saveDataSetsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "sections") {
          promises.push(
            this.sectionProvider.saveSectionsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "dataElements") {
          promises.push(
            this.dataElementProvider.saveDataElementsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "indicators") {
          promises.push(
            this.indicatorProvider.savingIndicatorsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "smsCommand") {
          promises.push(
            this.smsCommandsProvider.savingSmsCommand(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "reports") {
          promises.push(
            this.reportsProvider.saveReportsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "constants") {
          promises.push(
            this.reportsProvider.saveConstantsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "programs") {
          promises.push(
            this.programProvider.saveProgramsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        } else if (resource == "programStageSections") {
          promises.push(
            this.programStageSectionsProvider.saveProgramsStageSectionsFromServer(data[resource], currentUser).subscribe(() => {
            }, error => {
            })
          );
        }
      });

      Observable.forkJoin(promises).subscribe(() => {
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        })
    });
  }

  /**
   *
   * @param resources
   * @param currentUser
   * @returns {Observable<any>}
   */
  prepareTablesToApplyChanges(resources, currentUser): Observable<any> {
    let promises = [];
    return new Observable(observer => {
      resources.forEach((resource: any) => {
        promises.push(
          this.sqLite.dropTable(resource, currentUser.currentDatabase).subscribe(() => {
          }, error => {
          })
        )
      });
      Observable.forkJoin(promises).subscribe(() => {
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        })
    });
  }

}
