import { Injectable } from '@angular/core';
import { SqlLiteProvider } from '../sql-lite/sql-lite';
import { HttpClientProvider } from '../http-client/http-client';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { DataSet } from '../../models/dataSet';
import { CurrentUser } from '../../models/currentUser';

/*
  Generated class for the DataSetsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class DataSetsProvider {
  resource: string;
  lastSelectedDataSet: any;

  constructor(
    private SqlLite: SqlLiteProvider,
    private HttpClient: HttpClientProvider
  ) {
    this.resource = 'dataSets';
  }

  /**
   *
   */
  resetDataSets() {
    this.lastSelectedDataSet = null;
  }

  /**
   *
   * @param dataSet
   */
  setLastSelectedDataSet(dataSet) {
    this.lastSelectedDataSet = dataSet;
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  getAllDataSetsSMSCodeGeneration(currentUser): Observable<any> {
    let url =
      '/api/dataSets.json?fields=id,dataSetElements[dataElement[id,categoryCombo[categoryOptionCombos[id]]]],dataElements[id,categoryCombo[categoryOptionCombos[id]]]';
    return new Observable(observer => {
      this.HttpClient.get(url, false, currentUser, this.resource, 25).subscribe(
        (response: any) => {
          observer.next(response[this.resource]);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param currentUser
   */
  getAllDataSets(currentUser): Observable<any> {
    return new Observable(observer => {
      this.SqlLite.getAllDataFromTable(
        this.resource,
        currentUser.currentDatabase
      ).subscribe(
        (dataSetsResponse: any) => {
          this.getAllDataSetElementsMapper(currentUser).subscribe(
            (dataSetElementMapper: any) => {
              let dataSets: Array<DataSet> = [];
              dataSetsResponse.map((dataSet: any) => {
                let dataElemets = dataSetElementMapper[dataSet.id]
                  ? dataSetElementMapper[dataSet.id]
                  : [];
                dataSets.push({
                  id: dataSet.id,
                  name: dataSet.name,
                  dataElements: dataElemets
                });
              });
              observer.next(dataSets);
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
   * @param currentUser
   */
  getAllDataSetElementsMapper(currentUser): Observable<any> {
    return new Observable(observer => {
      this.SqlLite.getAllDataFromTable(
        'dataSetElements',
        currentUser.currentDatabase
      ).subscribe(
        (dataSetElements: any) => {
          const dataElementids = _.map(
            dataSetElements,
            (dataSetElement: any) => {
              return dataSetElement.dataElementId;
            }
          );
          let dataSetElementMapper = {};
          this.getAllDataElementsMapper(currentUser, dataElementids).subscribe(
            (dataElementMapper: any) => {
              dataSetElements.map((dataSetElement: any) => {
                if (!dataSetElementMapper[dataSetElement.dataSetId]) {
                  dataSetElementMapper[dataSetElement.dataSetId] = [];
                }
                dataSetElementMapper[dataSetElement.dataSetId].push(
                  dataElementMapper[dataSetElement.dataElementId]
                );
              });
              observer.next(dataSetElementMapper);
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
   * @param currentUser
   * @param dataElementIds
   */
  getAllDataElementsMapper(
    currentUser,
    dataElementIds: Array<string>
  ): Observable<any> {
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        'dataElements',
        'id',
        dataElementIds,
        currentUser.currentDatabase
      ).subscribe(
        (dataElements: any) => {
          let dataElementsmapper = {};
          dataElements.map((dataElement: any) => {
            dataElementsmapper[dataElement.id] = {
              id: dataElement.id,
              categoryCombo: dataElement.categoryCombo
            };
          });
          observer.next(dataElementsmapper);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param orgUnitId
   * @param dataSetIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getAssignedDataSets(orgUnitId, dataSetIds, currentUser): Observable<any> {
    let attributeKey = 'id';
    let attributeArray = [];
    return new Observable(observer => {
      this.getDataSetSourceDataSetIds(orgUnitId, currentUser).subscribe(
        (dataSetSourceDataSetIds: any) => {
          if (
            currentUser.authorities &&
            currentUser.authorities.indexOf('ALL') > -1
          ) {
            attributeArray = dataSetSourceDataSetIds;
          } else {
            dataSetSourceDataSetIds.map((dataSetSourceDataSetId: any) => {
              if (dataSetIds.indexOf(dataSetSourceDataSetId) != -1) {
                attributeArray.push(dataSetSourceDataSetId);
              }
            });
          }
          this.SqlLite.getDataFromTableByAttributes(
            this.resource,
            attributeKey,
            attributeArray,
            currentUser.currentDatabase
          ).subscribe(
            (dataSets: any) => {
              if (dataSets && dataSets.length > 0) {
                dataSets = this.sortDataSetList(dataSets);
                let hasSelectedDataSet = false;
                if (this.lastSelectedDataSet && this.lastSelectedDataSet.id) {
                  const matchDataSetIds = _.filter(dataSets, {
                    id: this.lastSelectedDataSet.id
                  });
                  if (matchDataSetIds.length > 0) {
                    hasSelectedDataSet = true;
                  }
                }
                if (!hasSelectedDataSet) {
                  this.setLastSelectedDataSet(dataSets[0]);
                }
              } else {
                this.resetDataSets();
              }
              observer.next(dataSets);
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
   * @param selectedOrgUnitId
   * @param categories
   * @returns {Array}
   */
  getDataSetCategoryComboCategories(selectedOrgUnitId, categories) {
    let categoryComboCategories = [];
    categories.map((category: any) => {
      let categoryOptions = [];
      category.categoryOptions.map((categoryOption: any) => {
        if (this.isOrganisationUnitAllowed(selectedOrgUnitId, categoryOption)) {
          categoryOptions.push({
            id: categoryOption.id,
            name: categoryOption.name
          });
        }
      });
      categoryComboCategories.push({
        id: category.id,
        name: category.name,
        categoryOptions: categoryOptions
      });
    });
    return categoryComboCategories;
  }

  /**
   *
   * @param selectedOrgUnitId
   * @param categoryOption
   * @returns {boolean}
   */
  isOrganisationUnitAllowed(selectedOrgUnitId, categoryOption) {
    let result = true;
    if (
      categoryOption.organisationUnits &&
      categoryOption.organisationUnits.length > 0
    ) {
      result = false;
      const matchedOus = _.filter(categoryOption.organisationUnits, {
        id: selectedOrgUnitId
      });
      if (matchedOus.length > 0) {
        result = true;
      }
    }
    return result;
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataSetById(dataSetId, currentUser): Observable<any> {
    let attributeKey = 'id';
    let attributeArray = [dataSetId];
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        this.resource,
        attributeKey,
        attributeArray,
        currentUser.currentDatabase
      ).subscribe(
        (dataSets: any) => {
          if (dataSets && dataSets.length > 0) {
            observer.next(dataSets[0]);
            observer.complete();
          } else {
            observer.error();
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataSetSectionsIds(dataSetId, currentUser): Observable<any> {
    const resource = 'dataSetSections';
    let attributeKey = 'id';
    let attributeArray = [dataSetId];
    let sectionIds = [];
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        resource,
        attributeKey,
        attributeArray,
        currentUser.currentDatabase
      ).subscribe(
        (dataSetsSectionsResponse: any) => {
          if (dataSetsSectionsResponse && dataSetsSectionsResponse.length > 0) {
            sectionIds = dataSetsSectionsResponse[0].sectionIds;
          }
          observer.next(sectionIds);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataSetDataElements(dataSetId, currentUser): Observable<any> {
    let attributeKey = 'id';
    let attributeArray = [dataSetId];
    let dataSetElements = [];
    const resource = 'dataSetElements';
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        resource,
        attributeKey,
        attributeArray,
        currentUser.currentDatabase
      ).subscribe(
        (dataSetDataElementsResponse: any) => {
          if (
            dataSetDataElementsResponse &&
            dataSetDataElementsResponse.length > 0
          ) {
            let counter = 0;
            dataSetDataElementsResponse[0].dataElementIds.map(
              (dataElementId: any) => {
                dataSetElements = _.concat(dataSetElements, {
                  id: dataElementId,
                  sortOrder: counter
                });
                counter++;
              }
            );
          }
          observer.next(dataSetElements);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable}
   */
  getDataSetIndicatorIds(dataSetId, currentUser): Observable<any> {
    const resource = 'dataSetIndicators';
    let attributeKey = 'id';
    let attributeArray = [dataSetId];
    let indicatorIds = [];
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        resource,
        attributeKey,
        attributeArray,
        currentUser.currentDatabase
      ).subscribe(
        (data: any) => {
          if (data && data.length > 0) {
            indicatorIds = data[0].indicatorIds;
          }
          observer.next(indicatorIds);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param currentUser
   * @returns {Observable<any>}
   */
  downloadDataSetsFromServer(currentUser): Observable<any> {
    let dataSets = [];
    let counts = 0;
    const { userOrgUnitIds } = currentUser;
    return new Observable(observer => {
      if (userOrgUnitIds && userOrgUnitIds.length == 0) {
        observer.next(dataSets);
        observer.complete();
      } else {
        const fields =
          'fields=id,name,timelyDays,formType,dataEntryForm[htmlCode],compulsoryDataElementOperands[name,dimensionItemType,dimensionItem],version,periodType,openFuturePeriods,expiryDays,dataSetElements[dataElement[id]],dataElements[id],organisationUnits[id],sections[id],indicators[id],categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name,organisationUnits[id]]]]';
        const filter =
          'filter=organisationUnits.path:ilike:' +
          userOrgUnitIds.join('&filter=path:ilike:') +
          '&rootJunction=OR';
        const url =
          '/api/25/' + this.resource + '.json?' + fields + '&' + filter;
        this.HttpClient.get(
          url,
          false,
          currentUser,
          this.resource,
          25
        ).subscribe(
          (response: any) => {
            try {
              dataSets = response[this.resource];
              observer.next(dataSets);
              observer.complete();
            } catch (e) {
              observer.error(e);
            }
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveDataSetsFromServer(dataSets, currentUser): Observable<any> {
    return new Observable(observer => {
      if (dataSets.length == 0) {
        observer.next();
        observer.complete();
      } else {
        const totalProcess = 7;
        let completeProcess = 0;
        this.SqlLite.insertBulkDataOnTable(
          this.resource,
          dataSets,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            completeProcess++;
            if (completeProcess == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error(error);
          }
        );
        this.saveDataEntryFormDesign(dataSets, currentUser).subscribe(
          () => {
            completeProcess++;
            if (completeProcess == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error();
          }
        );
        this.saveDataSetIndicators(dataSets, currentUser).subscribe(
          () => {
            completeProcess++;
            if (completeProcess == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error();
          }
        );
        this.saveDataSetSource(dataSets, currentUser).subscribe(
          () => {
            completeProcess++;
            if (completeProcess == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error();
          }
        );
        this.saveDataSetSections(dataSets, currentUser).subscribe(
          () => {
            completeProcess++;
            if (completeProcess == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error();
          }
        );
        this.saveDataSetOperands(dataSets, currentUser).subscribe(
          () => {
            completeProcess++;
            if (completeProcess == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error();
          }
        );
        this.saveDataSetElements(dataSets, currentUser).subscribe(
          () => {
            completeProcess++;
            if (completeProcess == totalProcess) {
              observer.next();
              observer.complete();
            }
          },
          error => {
            observer.error();
          }
        );
      }
    });
  }

  saveDataEntryFormDesign(dataSets, currentUser): Observable<any> {
    return new Observable(observer => {
      let entryFormDesign = [];
      const resource = 'dataSetDesign';
      dataSets.map((dataSet: any) => {
        if (dataSet.dataEntryForm && dataSet.dataEntryForm.htmlCode) {
          entryFormDesign.push({
            id: dataSet.id,
            dataSetDesign: dataSet.dataEntryForm.htmlCode
          });
        }
      });
      if (entryFormDesign.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          entryFormDesign,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  getDataEntryFormDesign(dataSetId, currentUser: CurrentUser): Observable<any> {
    return new Observable(observer => {
      let entryFormDesign = '';
      const resource = 'dataSetDesign';
      this.SqlLite.getDataFromTableByAttributes(
        resource,
        'id',
        [dataSetId],
        currentUser.currentDatabase
      ).subscribe(
        (entryFormDesigns: any) => {
          if (entryFormDesigns && entryFormDesigns.length > 0) {
            entryFormDesign = entryFormDesigns[0].dataSetDesign;
          }
          observer.next(entryFormDesign);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveDataSetIndicators(dataSets, currentUser): Observable<any> {
    let dataSetIndicators = [];
    const resource = 'dataSetIndicators';
    dataSets.map((dataSet: any) => {
      if (dataSet.indicators && dataSet.indicators.length > 0) {
        dataSetIndicators = _.concat(dataSetIndicators, {
          id: dataSet.id,
          indicatorIds: _.map(dataSet.indicators, (indicator: any) => {
            return indicator.id;
          })
        });
      }
    });
    return new Observable(observer => {
      if (dataSetIndicators.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          dataSetIndicators,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveDataSetSource(dataSets, currentUser): Observable<any> {
    let dataSetSource = [];
    const resource = 'dataSetSource';
    dataSets.map((dataSet: any) => {
      if (dataSet.organisationUnits && dataSet.organisationUnits.length > 0) {
        dataSetSource = _.concat(dataSetSource, {
          id: dataSet.id,
          organisationUnitIds: _.map(
            dataSet.organisationUnits,
            (organisationUnit: any) => {
              return organisationUnit.id;
            }
          )
        });
      }
    });
    return new Observable(observer => {
      if (dataSetSource.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          dataSetSource,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  /**
   *
   * @param orgUnitId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getDataSetSourceDataSetIds(
    orgUnitId,
    currentUser: CurrentUser
  ): Observable<any> {
    const resource = 'dataSetSource';
    let dataSetIds = [];
    return new Observable(observer => {
      this.getAllDataSetSources(currentUser).subscribe(
        (dataSetSourcesResponse: any) => {
          if (dataSetSourcesResponse && dataSetSourcesResponse.length > 0) {
            dataSetSourcesResponse.map((dataSetSource: any) => {
              if (
                dataSetSource &&
                dataSetSource.organisationUnitIds &&
                dataSetSource.organisationUnitIds.indexOf(orgUnitId) > -1
              ) {
                dataSetIds.push(dataSetSource.id);
              }
            });
          }
          observer.next(dataSetIds);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getAllDataSetSources(currentUser: CurrentUser): Observable<any> {
    const resource = 'dataSetSource';
    return new Observable(observer => {
      this.SqlLite.getAllDataFromTable(
        resource,
        currentUser.currentDatabase
      ).subscribe(
        (dataSetSource: any) => {
          observer.next(dataSetSource);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveDataSetSections(dataSets, currentUser): Observable<any> {
    let dataSetSections = [];
    const resource = 'dataSetSections';
    dataSets.map((dataSet: any) => {
      if (dataSet.sections && dataSet.sections.length > 0) {
        dataSetSections = _.concat(dataSetSections, {
          id: dataSet.id,
          sectionIds: _.map(dataSet.sections, (section: any) => {
            return section.id;
          })
        });
      }
    });
    return new Observable(observer => {
      if (dataSetSections.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          dataSetSections,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveDataSetOperands(dataSets, currentUser): Observable<any> {
    let dataSetOperands = [];
    const resource = 'dataSetOperands';
    dataSets.map((dataSet: any) => {
      if (
        dataSet.compulsoryDataElementOperands &&
        dataSet.compulsoryDataElementOperands.length > 0
      ) {
        dataSetOperands = _.concat(
          dataSetOperands,
          _.map(
            dataSet.compulsoryDataElementOperands,
            (compulsoryDataElementOperand: any) => {
              return {
                id:
                  dataSet.id + '-' + compulsoryDataElementOperand.dimensionItem,
                dataSetId: dataSet.id,
                name: compulsoryDataElementOperand.name,
                dimensionItemType:
                  compulsoryDataElementOperand.dimensionItemType,
                dimensionItem: compulsoryDataElementOperand.dimensionItem
              };
            }
          )
        );
      }
    });
    return new Observable(observer => {
      if (dataSetOperands.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          dataSetOperands,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Observable<any>}
   */
  saveDataSetElements(dataSets, currentUser): Observable<any> {
    let dataSetElements = [];
    const resource = 'dataSetElements';
    dataSets.map((dataSet: any) => {
      if (dataSet.dataSetElements && dataSet.dataSetElements.length > 0) {
        dataSetElements = _.concat(dataSetElements, {
          id: dataSet.id,
          dataElementIds: _.map(
            dataSet.dataSetElements,
            (dataSetElement: any) => {
              return dataSetElement.dataElement.id;
            }
          )
        });
      }
      if (dataSet.dataElements && dataSet.dataElements.length > 0) {
        dataSetElements = _.concat(dataSetElements, {
          id: dataSet.id,
          dataElementIds: _.map(dataSet.dataElements, (dataElement: any) => {
            return dataElement.id;
          })
        });
      }
    });
    return new Observable(observer => {
      if (dataSetElements.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(
          resource,
          dataSetElements,
          currentUser.currentDatabase
        ).subscribe(
          () => {
            observer.next();
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      }
    });
  }

  /**
   * sortDataSetList
   * @param dataSetList
   * @returns {any}
   */
  sortDataSetList(dataSetList) {
    return _.sortBy(dataSetList, ['name']);
  }

  /**
   *
   * @param dataSetsIds
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataSetsByIds(dataSetsIds, currentUser): Observable<any> {
    let attribute = 'id';
    let dataSetsResponse = [];
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(
        this.resource,
        attribute,
        dataSetsIds,
        currentUser.currentDatabase
      ).subscribe(
        (dataSets: any) => {
          this.sortDataSetList(dataSets);
          dataSets.map((dataSet: any) => {
            dataSetsResponse.push({
              id: dataSet.id,
              name: dataSet.name,
              dataElements: dataSet.dataElements,
              dataSetElements: dataSet.dataSetElements
            });
          });
          observer.next(dataSetsResponse);
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}
