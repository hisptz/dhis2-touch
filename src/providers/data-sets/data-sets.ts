import {Injectable} from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";
import {Observable} from "rxjs/Observable";
import {DataSet} from "../../models/dataSet";

/*
  Generated class for the DataSetsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class DataSetsProvider {

  resource: string;
  lastSelectedDataSet: any;

  constructor(private SqlLite: SqlLiteProvider, private HttpClient: HttpClientProvider) {
    this.resource = "dataSets";
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
   */
  getAllDataSets(currentUser) : Observable<any>{
    return new Observable(observer=>{
      this.SqlLite.getAllDataFromTable(this.resource, currentUser.currentDatabase).subscribe((dataSetsResponse: any) => {
        this.getAllDataSetElementsMapper(currentUser).subscribe((dataSetElementMapper : any)=>{
          let dataSets : Array<DataSet> = [];
          dataSetsResponse.map((dataSet : any)=>{
            let dataElemets = (dataSetElementMapper[dataSet.id])? dataSetElementMapper[dataSet.id] : [];
            dataSets.push(
              {id : dataSet.id,name : dataSet.name, dataElements :dataElemets}
            );
          })
          observer.next(dataSets);        
          observer.complete();
        },error=>{
          observer.error(error);
        });        
      }, error => {
        observer.error(error)
      })
    });
  }

  /**
   * 
   * @param currentUser 
   */
  getAllDataSetElementsMapper(currentUser) : Observable<any>{
    return new Observable(observer=>{
      this.SqlLite.getAllDataFromTable("dataSetElements", currentUser.currentDatabase).subscribe((dataSetElements: any) => {
        let dataElementids = [];
        let dataSetElementMapper = {};
        dataSetElements.map((dataSetElement : any)=>{
          dataElementids.push(dataSetElement.dataElementId);
        });
        this.getAllDataElementsMapper(currentUser,dataElementids).subscribe((dataElementMapper : any)=>{
          dataSetElements.map((dataSetElement : any)=>{
            if(!dataSetElementMapper[dataSetElement.dataSetId]){
              dataSetElementMapper[dataSetElement.dataSetId] = []
            }
            dataSetElementMapper[dataSetElement.dataSetId].push(dataElementMapper[dataSetElement.dataElementId]);       
          });
          observer.next(dataSetElementMapper);
        observer.complete();
        },error=>{
          observer.error(error);
        })
        
      }, error => {
        observer.error(error)
      })
    });
  }

  /**
   * 
   * @param currentUser 
   * @param dataElementIds 
   */
  getAllDataElementsMapper(currentUser,dataElementIds : Array<string>) : Observable<any>{
    return new Observable(observer=>{
      this.SqlLite.getDataFromTableByAttributes("dataElements","id",dataElementIds,currentUser.currentDatabase).subscribe((dataElements: any) => {
        let dataElementsmapper = {};
        dataElements.map((dataElement : any)=>{
          dataElementsmapper[dataElement.id] = {
            id : dataElement.id,categoryCombo : dataElement.categoryCombo
          }
        })
        observer.next(dataElementsmapper);
        observer.complete();
      }, error => {
        observer.error(error)
      })
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
    let attributeKey = "id";
    let attributeArray = [];
    return new Observable(observer => {
      this.getDataSetSource(orgUnitId, currentUser.currentDatabase).subscribe((dataSources: any) => {
        if (currentUser.authorities && (currentUser.authorities.indexOf("ALL") > -1)) {
          dataSources.forEach((dataSource: any) => {
            attributeArray.push(dataSource.dataSetId);
          });
        } else {
          dataSources.forEach((dataSource: any) => {
            if (dataSetIds.indexOf(dataSource.dataSetId) != -1) {
              attributeArray.push(dataSource.dataSetId);
            }
          });
        }
        this.SqlLite.getDataFromTableByAttributes(this.resource, attributeKey, attributeArray, currentUser.currentDatabase).subscribe((dataSets: any) => {
          if (dataSets && dataSets.length > 0) {
            dataSets = this.sortDataSetList(dataSets);
            let hasSelectedDataSet = false;
            if (this.lastSelectedDataSet && this.lastSelectedDataSet.id) {
              dataSets.forEach((dataSet: any) => {
                if (dataSet.id == this.lastSelectedDataSet.id) {
                  hasSelectedDataSet = true;
                }
              });
            }
            if (!hasSelectedDataSet) {
              this.setLastSelectedDataSet(dataSets[0]);
            }
          } else {
            this.resetDataSets();
          }
          observer.next(dataSets);
          observer.complete();
        }, error => {
          observer.error(error)
        })
      }, error => {
        observer.error(error)
      });
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
    categories.forEach((category: any) => {
      let categoryOptions = [];
      category.categoryOptions.forEach((categoryOption: any) => {
        if (this.isOrganisationUnitAllowed(selectedOrgUnitId, categoryOption)) {
          categoryOptions.push({
            id: categoryOption.id, name: categoryOption.name
          })
        }
      });
      categoryComboCategories.push({
        id: category.id, name: category.name, categoryOptions: categoryOptions
      })
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
    if (categoryOption.organisationUnits && categoryOption.organisationUnits.length > 0) {
      result = false;
      categoryOption.organisationUnits.forEach((organisationUnit: any) => {
        if (selectedOrgUnitId == organisationUnit.id) {
          result = true;
        }
      });
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
    let attributeKey = "id";
    let attributeArray = [dataSetId];
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(this.resource, attributeKey, attributeArray, currentUser.currentDatabase).subscribe((dataSets: any) => {
        if (dataSets && dataSets.length > 0) {
          observer.next(dataSets[0]);
          observer.complete();
        } else {
          observer.error();
        }
      }, error => {
        observer.error(error)
      })
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataSetSectionsIds(dataSetId, currentUser): Observable<any> {
    let resource = "dataSetSections";
    let attributeKey = "dataSetId";
    let attributeArray = [dataSetId];
    let sectionIds = [];
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeArray, currentUser.currentDatabase).subscribe((dataSetsSections: any) => {
        if (dataSetsSections && dataSetsSections.length > 0) {
          dataSetsSections.forEach((dataSetsSection: any) => {
            sectionIds.push(dataSetsSection.sectionId);
          });
        }
        observer.next(sectionIds);
        observer.complete();
      }, error => {
        observer.error(error)
      })
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable<any>}
   */
  getDataSetDataElements(dataSetId, currentUser): Observable<any> {
    let attributeKey = "dataSetId";
    let attributeArray = [dataSetId];
    let dataSetElements = [];
    let resource = "dataSetElements";
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeArray, currentUser.currentDatabase).subscribe((dataSetElementsIds: any) => {
        if (dataSetElementsIds && dataSetElementsIds.length > 0) {
          dataSetElementsIds.forEach((dataSetIndicatorId: any) => {
            dataSetElements.push({id: dataSetIndicatorId.dataElementId, sortOrder: dataSetIndicatorId.sortOrder});
          });
        }
        observer.next(dataSetElements);
        observer.complete();
      }, error => {
        observer.error(error)
      })
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Observable}
   */
  getDataSetIndicatorIds(dataSetId, currentUser): Observable<any> {
    let resource = "dataSetIndicators";
    let attributeKey = "dataSetId";
    let attributeArray = [dataSetId];
    let indicatorIds = [];
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeArray, currentUser.currentDatabase).subscribe((dataSetsIndicatorIds: any) => {
        if (dataSetsIndicatorIds && dataSetsIndicatorIds.length > 0) {
          dataSetsIndicatorIds.forEach((dataSetsSection: any) => {
            indicatorIds.push(dataSetsSection.indicatorId);
          });
        }
        observer.next(indicatorIds);
        observer.complete();
      }, error => {
        observer.error(error)
      })
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
    let userOrgUnitIds = currentUser.userOrgUnitIds;
    return new Observable(observer => {
      for (let userOrgUnitId of userOrgUnitIds) {
        let fields = "fields=id,name,timelyDays,formType,compulsoryDataElementOperands[name,dimensionItemType,dimensionItem],version,periodType,openFuturePeriods,expiryDays,dataSetElements[dataElement[id]],dataElements[id],organisationUnits[id],sections[id],indicators[id],categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name,organisationUnits[id]]]]";
        let filter = "filter=organisationUnits.path:ilike:";
        let url = "/api/25/" + this.resource + ".json?paging=false&";
        url += fields + "&" + filter + userOrgUnitId;
        this.HttpClient.get(url, false, currentUser, this.resource, 25).subscribe((response: any) => {
          try {
            counts = counts + 1;
            dataSets = this.appendDataSetsFromServerToDataSetArray(dataSets, response);
            if (counts == userOrgUnitIds.length) {
              observer.next(dataSets);
              observer.complete();
            }
          } catch (e) {
            observer.error(e);
          }
        }, error => {
          observer.error(error);
        })
      }
    });
  }

  /**
   * appendDataSetsFromServerToDataSetArray
   * @param dataSetArray
   * @param dataSetsResponse
   * @returns {any}
   */
  appendDataSetsFromServerToDataSetArray(dataSetArray, dataSetsResponse) {
    if (dataSetsResponse[this.resource]) {
      for (let dataSets of dataSetsResponse[this.resource]) {
        dataSetArray.push(dataSets);
      }
    }
    return dataSetArray;
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
        this.SqlLite.insertBulkDataOnTable(this.resource, dataSets, currentUser.currentDatabase).subscribe(() => {
          this.saveDataSetIndicators(dataSets, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
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
    let resource = "dataSetIndicators";
    dataSets.forEach((dataSet: any) => {
      if (dataSet.indicators && dataSet.indicators.length > 0) {
        dataSet.indicators.forEach((indicator: any) => {
          dataSetIndicators.push({
            id: dataSet.id + "-" + indicator.id,
            dataSetId: dataSet.id,
            indicatorId: indicator.id
          });
        });
      }
    });
    return new Observable(observer => {
      if (dataSetIndicators.length == 0) {
        this.saveDataSetSource(dataSets, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.SqlLite.insertBulkDataOnTable(resource, dataSetIndicators, currentUser.currentDatabase).subscribe(() => {
          this.saveDataSetSource(dataSets, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
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
    let resource = "dataSetSource";
    dataSets.forEach((dataSet: any) => {
      if (dataSet.organisationUnits && dataSet.organisationUnits.length > 0) {
        dataSet.organisationUnits.forEach((organisationUnit: any) => {
          dataSetSource.push({
            id: dataSet.id + "-" + organisationUnit.id,
            dataSetId: dataSet.id,
            organisationUnitId: organisationUnit.id
          });
        })
      }
    });
    return new Observable(observer => {
      if (dataSetSource.length == 0) {
        this.saveDataSetSections(dataSets, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.SqlLite.insertBulkDataOnTable(resource, dataSetSource, currentUser.currentDatabase).subscribe(() => {
          this.saveDataSetSections(dataSets, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   *
   * @param orgUnitId
   * @param dataBaseName
   * @returns {Observable<any>}
   */
  getDataSetSource(orgUnitId, dataBaseName): Observable<any> {
    let resource = "dataSetSource";
    let attributeValue = [orgUnitId];
    let attributeKey = "organisationUnitId";
    return new Observable(observer => {
      this.SqlLite.getDataFromTableByAttributes(resource, attributeKey, attributeValue, dataBaseName).subscribe((dataSetSource: any) => {
        observer.next(dataSetSource);
        observer.complete();
      }, error => {
        observer.error(error)
      })
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
    let resource = "dataSetSections";
    dataSets.forEach((dataSet: any) => {
      if (dataSet.sections && dataSet.sections.length > 0) {
        dataSet.sections.forEach((section: any) => {
          dataSetSections.push({
            id: dataSet.id + "-" + section.id,
            dataSetId: dataSet.id,
            sectionId: section.id
          });
        })
      }
    });
    return new Observable(observer => {
      if (dataSetSections.length == 0) {
        this.saveDataSetOperands(dataSets, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.SqlLite.insertBulkDataOnTable(resource, dataSetSections, currentUser.currentDatabase).subscribe(() => {
          this.saveDataSetOperands(dataSets, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
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
    let resource = "dataSetOperands";
    dataSets.forEach((dataSet: any) => {
      if (dataSet.compulsoryDataElementOperands && dataSet.compulsoryDataElementOperands.length > 0) {
        dataSet.compulsoryDataElementOperands.forEach((compulsoryDataElementOperand: any) => {
          dataSetOperands.push({
            id: dataSet.id + "-" + compulsoryDataElementOperand.dimensionItem,
            dataSetId: dataSet.id,
            name: compulsoryDataElementOperand.name,
            dimensionItemType: compulsoryDataElementOperand.dimensionItemType,
            dimensionItem: compulsoryDataElementOperand.dimensionItem
          });
        });
      }
    });
    return new Observable(observer => {
      if (dataSetOperands.length == 0) {
        this.saveDataSetElements(dataSets, currentUser).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      } else {
        this.SqlLite.insertBulkDataOnTable(resource, dataSetOperands, currentUser.currentDatabase).subscribe(() => {
          this.saveDataSetElements(dataSets, currentUser).subscribe(() => {
            observer.next();
            observer.complete();
          }, error => {
            observer.error(error);
          });
        }, error => {
          observer.error(error);
        });
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
    let resource = "dataSetElements";
    dataSets.forEach((dataSet: any) => {
      if (dataSet.dataSetElements && dataSet.dataSetElements.length > 0) {
        let count = 0;
        dataSet.dataSetElements.forEach((dataSetElement: any) => {
          if (dataSetElement.dataElement.id && dataSetElement.dataElement.id)
            dataSetElements.push({
              id: dataSet.id + "-" + dataSetElement.dataElement.id,
              dataSetId: dataSet.id,
              sortOrder: count,
              dataElementId: dataSetElement.dataElement.id
            });
          count++;
        })
      }
      if (dataSet.dataElements && dataSet.dataElements.length > 0) {
        let count = 0;
        dataSet.dataElements.forEach((dataElement: any) => {
          dataSetElements.push({
            id: dataSet.id + "-" + dataElement.id,
            dataSetId: dataSet.id,
            sortOrder: count,
            dataElementId: dataElement.id
          });
          count++;
        })
      }
    });
    return new Observable(observer => {
      if (dataSetElements.length == 0) {
        observer.next();
        observer.complete();
      } else {
        this.SqlLite.insertBulkDataOnTable(resource, dataSetElements, currentUser.currentDatabase).subscribe(() => {
          observer.next();
          observer.complete();
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  /**
   * sortDataSetList
   * @param dataSetList
   * @returns {any}
   */
  sortDataSetList(dataSetList) {
    dataSetList.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    return dataSetList;
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
      this.SqlLite.getDataFromTableByAttributes(this.resource, attribute, dataSetsIds, currentUser.currentDatabase).subscribe((dataSets: any) => {
        this.sortDataSetList(dataSets);
        dataSets.forEach((dataSet: any) => {
          dataSetsResponse.push({
            id: dataSet.id,
            name: dataSet.name,
            dataElements: dataSet.dataElements,
            dataSetElements: dataSet.dataSetElements
          });
        });
        observer.next(dataSetsResponse);
      }, error => {
        observer.error(error);
      })
    });
  }

}
