import { Injectable } from '@angular/core';
import { DataSetsProvider } from '../data-sets/data-sets';
import { DataElementsProvider } from '../data-elements/data-elements';
import { IndicatorsProvider } from '../indicators/indicators';
import { SectionsProvider } from '../sections/sections';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the DataEntryFormProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataEntryFormProvider {
  constructor(
    private dataSetProvider: DataSetsProvider,
    private indicatorProvider: IndicatorsProvider,
    private sectionProvider: SectionsProvider,
    private dataElementProvider: DataElementsProvider
  ) {}

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable<any>}
   */
  loadingDataSetInformation(dataSetId, currentUser): Observable<any> {
    return new Observable(observer => {
      this.dataSetProvider.getDataSetById(dataSetId, currentUser).subscribe(
        (dataSet: any) => {
          this.dataSetProvider
            .getDataSetSectionsIds(dataSetId, currentUser)
            .subscribe(
              sectionIds => {
                this.dataSetProvider
                  .getDataSetIndicatorIds(dataSetId, currentUser)
                  .subscribe(
                    indicatorIds => {
                      observer.next({
                        dataSet: dataSet,
                        sectionIds: sectionIds,
                        indicatorIds: indicatorIds
                      });
                      observer.complete();
                    },
                    error => {
                      observer.error(error);
                    }
                  );
              },
              error => {
                observer.error(error);
              }
            );
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param indicatorIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getEntryFormIndicators(indicatorIds, currentUser): Observable<any> {
    return this.indicatorProvider.getIndicatorsByIds(indicatorIds, currentUser);
  }

  /**
   *
   * @param sectionIds
   * @param dataSetId
   * @param appSettings
   * @param currentUser
   * @returns {Observable<any>}
   */
  getEntryForm(
    sectionIds,
    dataSetId,
    appSettings,
    currentUser
  ): Observable<any> {
    return new Observable(Observer => {
      if (sectionIds && sectionIds.length > 0) {
        this.getSectionEntryForm(sectionIds, currentUser).subscribe(
          (entryForm: any) => {
            Observer.next(entryForm);
            Observer.complete();
          },
          error => {
            Observer.error(error);
          }
        );
      } else {
        this.getDefaultEntryForm(dataSetId, appSettings, currentUser).subscribe(
          (entryForm: any) => {
            Observer.next(entryForm);
            Observer.complete();
          },
          error => {
            Observer.error(error);
          }
        );
      }
    });
  }

  /**
   *
   * @param sectionIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getSectionEntryForm(sectionIds, currentUser): Observable<any> {
    return new Observable(observer => {
      this.sectionProvider.getSectionByIds(sectionIds, currentUser).subscribe(
        (sections: any) => {
          let count = 0;
          sections.forEach((section: any) => {
            this.dataElementProvider
              .getDataElementsByIdsForDataEntry(
                section.dataElementIds,
                currentUser
              )
              .subscribe(
                (dataElements: any) => {
                  section['dataElements'] = dataElements;
                  count++;
                  if (count == sections.length) {
                    sections = this.getSortedSections(sections);
                    observer.next(sections);
                    observer.complete();
                  }
                },
                error => {
                  observer.error(error);
                }
              );
          });
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param {any[]} sections
   * @returns {any[]}
   */
  getSortedSections(sections: any[]) {
    sections = sections.sort((a, b) => {
      return parseInt(a.sortOrder) - parseInt(b.sortOrder);
    });
    return sections;
  }

  /**
   *
   * @param dataSetId
   * @param appSettings
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDefaultEntryForm(dataSetId, appSettings, currentUser): Observable<any> {
    return new Observable(observer => {
      this.dataSetProvider
        .getDataSetDataElements(dataSetId, currentUser)
        .subscribe(
          (dataSetDatElements: any) => {
            this.dataElementProvider
              .getDataElementsByIdsForDataEntry(dataSetDatElements, currentUser)
              .subscribe(
                (dataElements: any) => {
                  let maxDataElements =
                    appSettings &&
                    appSettings.entryForm &&
                    appSettings.entryForm.maxDataElementOnDefaultForm
                      ? appSettings.entryForm.maxDataElementOnDefaultForm
                      : 10;
                  observer.next(
                    this.getDataElementSections(dataElements, maxDataElements)
                  );
                  observer.complete();
                },
                error => {
                  observer.error(error);
                }
              );
          },
          error => {
            observer.error(error);
          }
        );
    });
  }

  /**
   *
   * @param dataElements
   * @param maxDataElements
   * @returns {Array}
   */
  getDataElementSections(dataElements, maxDataElements) {
    let sectionsCounter = Math.ceil(dataElements.length / maxDataElements);
    let sections = [];
    for (let index = 0; index < sectionsCounter; index++) {
      sections.push({
        name: 'Page ' + (index + 1) + ' of ' + sectionsCounter,
        id: index,
        dataElements: dataElements.splice(0, maxDataElements)
      });
    }
    return sections;
  }
}
