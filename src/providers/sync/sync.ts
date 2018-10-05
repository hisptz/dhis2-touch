import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataSetsProvider } from '../data-sets/data-sets';
import { OrganisationUnitsProvider } from '../organisation-units/organisation-units';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { SectionsProvider } from '../sections/sections';
import { DataElementsProvider } from '../data-elements/data-elements';
import { SmsCommandProvider } from '../sms-command/sms-command';
import { IndicatorsProvider } from '../indicators/indicators';
import { StandardReportProvider } from '../standard-report/standard-report';
import { ProgramsProvider } from '../programs/programs';
import { ProgramStageSectionsProvider } from '../program-stage-sections/program-stage-sections';
import * as _ from 'lodash';
import { CurrentUser } from '../../models/current-user';

/*
  Generated class for the SyncProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SyncProvider {
  constructor(
    private sqLite: SqlLiteProvider,
    private orgUnitsProvider: OrganisationUnitsProvider,
    private dataSetsProvider: DataSetsProvider,
    private sectionProvider: SectionsProvider,
    private dataElementProvider: DataElementsProvider,
    private smsCommandsProvider: SmsCommandProvider,
    private indicatorProvider: IndicatorsProvider,
    private reportsProvider: StandardReportProvider,
    private programProvider: ProgramsProvider,
    private programStageSectionsProvider: ProgramStageSectionsProvider
  ) {}

  getSyncContentDetails() {
    let syncContents = [
      {
        id: 'dataViaInternet',
        name: 'Upload data via internet',
        icon: 'assets/icon/internet.png'
      },
      {
        id: 'dataViaSms',
        name: 'Upload data via SMS',
        icon: 'assets/icon/sms.png'
      },
      {
        id: 'downloadMetadata',
        name: 'Download metadata',
        icon: 'assets/icon/download-metadata.png'
      },
      //{id : 'downloadData',name : 'Download data',icon: 'assets/icon/download-data.png'},
      {
        id: 'clearData',
        name: 'Clear local data',
        icon: 'assets/icon/clear-data.png'
      },
      {
        id: 'clearMetadata',
        name: 'Clear local metadata',
        icon: 'assets/icon/clear-metadata.png'
      }
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
    let data = {};
    let completedProcess = 0;
    return new Observable(observer => {
      for (let resource of resources) {
        if (resource == 'organisationUnits') {
          this.orgUnitsProvider
            .downloadingOrganisationUnitsFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response;
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'dataSets') {
          this.dataSetsProvider
            .downloadDataSetsFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response;
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'sections') {
          this.sectionProvider
            .downloadSectionsFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response[resource];
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'dataElements') {
          this.dataElementProvider
            .downloadDataElementsFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response[resource];
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'indicators') {
          this.indicatorProvider
            .downloadingIndicatorsFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response[resource];
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'smsCommand') {
          this.smsCommandsProvider
            .getSmsCommandFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response;
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'reports') {
          this.reportsProvider.downloadReportsFromServer(currentUser).subscribe(
            (response: any) => {
              data[resource] = response[resource];
              completedProcess++;
              if (completedProcess == resources.length) {
                observer.next(data);
                observer.complete();
              }
            },
            error => {
              observer.error(error);
            }
          );
        } else if (resource == 'constants') {
          this.reportsProvider
            .downloadConstantsFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response[resource];
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'programs') {
          this.programProvider
            .downloadProgramsFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response[resource];
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'programStageSections') {
          this.programStageSectionsProvider
            .downloadProgramsStageSectionsFromServer(currentUser)
            .subscribe(
              (response: any) => {
                data[resource] = response[resource];
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        }
      }
    });
  }

  /**
   *
   * @param resources
   * @param data
   * @param currentUser
   * @returns {Observable<any>}
   */
  savingResources(resources, data, currentUser: CurrentUser): Observable<any> {
    let completedProcess = 0;
    return new Observable(observer => {
      for (let resource of resources) {
        if (resource == 'organisationUnits') {
          this.orgUnitsProvider
            .savingOrganisationUnitsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {}
            );
        } else if (resource == 'dataSets') {
          this.dataSetsProvider
            .saveDataSetsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'sections') {
          this.sectionProvider
            .saveSectionsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'dataElements') {
          this.dataElementProvider
            .saveDataElementsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'indicators') {
          this.indicatorProvider
            .savingIndicatorsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'smsCommand') {
          this.smsCommandsProvider
            .savingSmsCommand(data[resource], currentUser.currentDatabase)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'reports') {
          this.reportsProvider
            .saveReportsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'constants') {
          this.reportsProvider
            .saveConstantsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'programs') {
          this.programProvider
            .saveProgramsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        } else if (resource == 'programStageSections') {
          this.programStageSectionsProvider
            .saveProgramsStageSectionsFromServer(data[resource], currentUser)
            .subscribe(
              () => {
                completedProcess++;
                if (completedProcess == resources.length) {
                  observer.next(data);
                  observer.complete();
                }
              },
              error => {
                observer.error(error);
              }
            );
        }
      }
    });
  }

  /**
   *
   * @param resources
   * @param currentUser
   * @returns {Observable<any>}
   */
  prepareTablesToApplyChanges(resources, currentUser): Observable<any> {
    let completedProcess = 0;
    return new Observable(observer => {
      const tablesTobeDeleted = this.getTablesToBeDeleted(resources);
      for (let resource of tablesTobeDeleted) {
        this.sqLite.dropTable(resource, currentUser.currentDatabase).subscribe(
          () => {
            completedProcess++;
            if (completedProcess == tablesTobeDeleted.length) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            completedProcess++;
            if (completedProcess == tablesTobeDeleted.length) {
              observer.next();
              observer.complete();
            }
          }
        );
      }
    });
  }

  getTablesToBeDeleted(resources) {
    let additionalTables = [];
    const dataBaseStructure = this.sqLite.getDataBaseStructure();
    resources.map((resource: string) => {
      const { dependentTable } = dataBaseStructure[resource];
      additionalTables = _.concat(additionalTables, dependentTable);
    });
    resources = _.concat(resources, additionalTables);
    return resources;
  }
}
