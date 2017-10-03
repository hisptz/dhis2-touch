import { Injectable } from '@angular/core';
import {SqlLiteProvider} from "../sql-lite/sql-lite";
import {HttpClientProvider} from "../http-client/http-client";

/*
  Generated class for the DataSetsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class DataSetsProvider {

  resource : string;
  lastSelectedDataSet : any;

  constructor(private SqlLite : SqlLiteProvider,private HttpClient : HttpClientProvider) {
    this.resource = "dataSets";
  }

  /**
   *
   */
  resetDataSets(){
    this.lastSelectedDataSet = null;
  }

  /**
   *
   * @param dataSet
   */
  setLastSelectedDataSet(dataSet){
    this.lastSelectedDataSet = dataSet;
  }

  /**
   *
   * @returns {any}
   */
  getLastSelectedDataSet(){
    return this.lastSelectedDataSet;
  }


  /**
   *
   * @param orgUnitId
   * @param dataSetIds
   * @param currentUser
   * @returns {Promise<any>}
   */
  getAssignedDataSets(orgUnitId,dataSetIds,currentUser){
    let attributeKey = "id";
    let attributeArray = [];
    return new Promise((resolve, reject)=> {
      this.getDataSetSource(orgUnitId,currentUser.currentDatabase).then((dataSources : any)=>{
        if(currentUser.authorities && (currentUser.authorities.indexOf("ALL") > -1)){
          dataSources.forEach((dataSource : any)=>{
            attributeArray.push(dataSource.dataSetId);
          });
        }else{
          dataSources.forEach((dataSource : any)=>{
            if(dataSetIds.indexOf(dataSource.dataSetId) != -1){
              attributeArray.push(dataSource.dataSetId);
            }
          });
        }
        this.SqlLite.getDataFromTableByAttributes(this.resource,attributeKey,attributeArray,currentUser.currentDatabase).then((dataSets : any)=>{
          if(dataSets && dataSets.length > 0){
            dataSets = this.sortDataSetList(dataSets);
            let hasSelectedDataSet = false;
            if(this.lastSelectedDataSet && this.lastSelectedDataSet.id){
              dataSets.forEach((dataSet : any)=>{
                if(dataSet.id == this.lastSelectedDataSet.id){
                  hasSelectedDataSet = true;
                }
              });
            }
            if(!hasSelectedDataSet){
              this.setLastSelectedDataSet(dataSets[0]);
            }
          }else{
            this.resetDataSets();
          }
          resolve(dataSets);
        },error=>{reject(error)})
      },error=>{reject(error)});
    });
  }

  /**
   *
   * @param selectedOrgUnitId
   * @param categories
   * @returns {Array}
   */
  getDataSetCategoryComboCategories(selectedOrgUnitId,categories){
    let categoryComboCategories = [];
    categories.forEach((category : any)=>{
      let categoryOptions = [];
      category.categoryOptions.forEach((categoryOption : any)=>{
        if(this.isOrganisationUnitAllowed(selectedOrgUnitId,categoryOption)){
          categoryOptions.push({
            id : categoryOption.id,name : categoryOption.name
          })
        }
      });
      categoryComboCategories.push({
        id : category.id,name : category.name ,categoryOptions : categoryOptions
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
  isOrganisationUnitAllowed(selectedOrgUnitId,categoryOption){
    let result = true;
    if(categoryOption.organisationUnits && categoryOption.organisationUnits.length > 0){
      result = false;
      categoryOption.organisationUnits.forEach((organisationUnit : any)=>{
        if(selectedOrgUnitId == organisationUnit.id){
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
   * @returns {Promise<any>}
   */
  getDataSetById(dataSetId,currentUser){
    let attributeKey = "id";
    let attributeArray = [dataSetId];
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(this.resource,attributeKey,attributeArray,currentUser.currentDatabase).then((dataSets : any)=>{
        if(dataSets && dataSets.length > 0){
          resolve(dataSets[0])
        }else{
          reject();
        }
      },error=>{reject(error)})
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDataSetSectionsIds(dataSetId,currentUser){
    let resource = "dataSetSections";
    let attributeKey = "dataSetId";
    let attributeArray = [dataSetId];
    let sectionIds = [];
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(resource,attributeKey,attributeArray,currentUser.currentDatabase).then((dataSetsSections : any)=>{
        if(dataSetsSections && dataSetsSections.length > 0){
          dataSetsSections.forEach((dataSetsSection : any)=>{
            sectionIds.push(dataSetsSection.sectionId);
          });
        }
        resolve(sectionIds);
      },error=>{reject(error)})
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDataSetDataElements(dataSetId,currentUser){
    let attributeKey = "dataSetId";
    let attributeArray = [dataSetId];
    let dataSetElements = [];
    let resource = "dataSetElements";
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(resource,attributeKey,attributeArray,currentUser.currentDatabase).then((dataSetElementsIds : any)=>{
        if(dataSetElementsIds && dataSetElementsIds.length > 0){
          dataSetElementsIds.forEach((dataSetIndicatorId : any)=>{
            dataSetElements.push({id : dataSetIndicatorId.dataElementId,sortOrder : dataSetIndicatorId.sortOrder});
          });
        }
        resolve(dataSetElements);
      },error=>{reject(error)})
    });
  }


  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDataSetIndicatorIds(dataSetId,currentUser){
    let resource = "dataSetIndicators";
    let attributeKey = "dataSetId";
    let attributeArray = [dataSetId];
    let indicatorIds = [];
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(resource,attributeKey,attributeArray,currentUser.currentDatabase).then((dataSetsIndicatorIds : any)=>{
        if(dataSetsIndicatorIds && dataSetsIndicatorIds.length > 0){
          dataSetsIndicatorIds.forEach((dataSetsSection : any)=>{
            indicatorIds.push(dataSetsSection.indicatorId);
          });
        }
        resolve(indicatorIds);
      },error=>{reject(error)})
    });
  }


  /**
   *
   * @param currentUser
   * @returns {Promise<T>}
   */
  downloadDataSetsFromServer(currentUser){
    let dataSets = [];
    let counts = 0;
    let userOrgUnitIds = currentUser.userOrgUnitIds;
    return new Promise((resolve, reject)=> {
      for(let userOrgUnitId of userOrgUnitIds){
        let fields="fields=id,name,timelyDays,formType,compulsoryDataElementOperands[name,dimensionItemType,dimensionItem],version,periodType,openFuturePeriods,expiryDays,dataSetElements[dataElement[id]],dataElements[id],organisationUnits[id],sections[id],indicators[id],categoryCombo[id,name,categoryOptionCombos[id,name,categoryOptions[id]],categories[id,name,categoryOptions[id,name,organisationUnits[id]]]]";
        let filter="filter=organisationUnits.path:ilike:";
        let url = "/api/25/"+this.resource+".json?paging=false&";
        url += fields + "&" + filter + userOrgUnitId;
        this.HttpClient.get(url,currentUser).then((response : any)=>{
          try{
            response = JSON.parse(response.data);
            counts = counts + 1;
            dataSets = this.appendDataSetsFromServerToDataSetArray(dataSets,response);
            if(counts == userOrgUnitIds.length){
              resolve(dataSets);
            }
          }catch (e){
            reject(e);
          }
        },error=>{
          reject(error);
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
  appendDataSetsFromServerToDataSetArray(dataSetArray,dataSetsResponse){
    if(dataSetsResponse[this.resource]){
      for(let dataSets of dataSetsResponse[this.resource]){
        dataSetArray.push(dataSets);
      }
    }
    return dataSetArray;
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Promise<T>}
   */
  saveDataSetsFromServer(dataSets,currentUser){
    return new Promise((resolve, reject)=> {
      if(dataSets.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(this.resource,dataSets,currentUser.currentDatabase).then(()=>{
          this.saveDataSetIndicators(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveDataSetIndicators(dataSets,currentUser){
    let dataSetIndicators = [];
    let resource = "dataSetIndicators";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.indicators && dataSet.indicators.length > 0){
        dataSet.indicators.forEach((indicator : any)=>{
          dataSetIndicators.push({
            id : dataSet.id + "-" + indicator.id,
            dataSetId : dataSet.id,
            indicatorId : indicator.id
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetIndicators.length == 0){
        this.saveDataSetSource(dataSets,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetIndicators,currentUser.currentDatabase).then(()=>{
          this.saveDataSetSource(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveDataSetSource(dataSets,currentUser){
    let dataSetSource = [];
    let resource = "dataSetSource";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.organisationUnits && dataSet.organisationUnits.length > 0){
        dataSet.organisationUnits.forEach((organisationUnit : any)=>{
          dataSetSource.push({
            id : dataSet.id +"-"+organisationUnit.id,
            dataSetId : dataSet.id,
            organisationUnitId : organisationUnit.id
          });
        })
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetSource.length == 0){
        this.saveDataSetSections(dataSets,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetSource,currentUser.currentDatabase).then(()=>{
          this.saveDataSetSections(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param orgUnitId
   * @param dataBaseName
   * @returns {Promise<any>}
   */
  getDataSetSource(orgUnitId,dataBaseName){
    let resource = "dataSetSource";
    let attributeValue  = [orgUnitId];
    let attributeKey = "organisationUnitId";
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(resource,attributeKey,attributeValue,dataBaseName).then((dataSetSource: any)=>{
        resolve(dataSetSource);
      },error=>{reject(error)})
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveDataSetSections(dataSets,currentUser){
    let dataSetSections = [];
    let resource = "dataSetSections";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.sections && dataSet.sections.length > 0){
        dataSet.sections.forEach((section : any)=>{
          dataSetSections.push({
            id : dataSet.id +"-"+section.id,
            dataSetId : dataSet.id,
            sectionId : section.id
          });
        })
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetSections.length == 0){
        this.saveDataSetOperands(dataSets,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetSections,currentUser.currentDatabase).then(()=>{
          this.saveDataSetOperands(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveDataSetOperands(dataSets,currentUser){
    let dataSetOperands = [];
    let resource = "dataSetOperands";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.compulsoryDataElementOperands && dataSet.compulsoryDataElementOperands.length > 0){
        dataSet.compulsoryDataElementOperands.forEach((compulsoryDataElementOperand : any)=>{
          dataSetOperands.push({
            id : dataSet.id +"-"+compulsoryDataElementOperand.dimensionItem,
            dataSetId : dataSet.id,
            name : compulsoryDataElementOperand.name,
            dimensionItemType : compulsoryDataElementOperand.dimensionItemType,
            dimensionItem : compulsoryDataElementOperand.dimensionItem
          });
        });
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetOperands.length == 0){
        this.saveDataSetElements(dataSets,currentUser).then(()=>{
          resolve();
        },error=>{
          reject(error);
        });
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetOperands,currentUser.currentDatabase).then(()=>{
          this.saveDataSetElements(dataSets,currentUser).then(()=>{
            resolve();
          },error=>{
            reject(error);
          });
        },error=>{
          reject(error);
        });
      }
    });
  }

  /**
   *
   * @param dataSets
   * @param currentUser
   * @returns {Promise<any>}
   */
  saveDataSetElements(dataSets,currentUser){
    let dataSetElements = [];
    let resource = "dataSetElements";
    dataSets.forEach((dataSet : any)=>{
      if(dataSet.dataSetElements && dataSet.dataSetElements.length > 0){
        let count = 0;
        dataSet.dataSetElements.forEach((dataSetElement : any)=>{
          if(dataSetElement.dataElement.id && dataSetElement.dataElement.id)
          dataSetElements.push({
            id : dataSet.id +"-"+dataSetElement.dataElement.id,
            dataSetId : dataSet.id,
            sortOrder : count,
            dataElementId : dataSetElement.dataElement.id
          });
          count ++;
        })
      }
      if(dataSet.dataElements && dataSet.dataElements.length > 0){
        let count = 0;
        dataSet.dataElements.forEach((dataElement : any)=>{
          dataSetElements.push({
            id : dataSet.id +"-"+dataElement.id,
            dataSetId : dataSet.id,
            sortOrder : count,
            dataElementId : dataElement.id
          });
          count ++;
        })
      }
    });
    return new Promise((resolve, reject)=> {
      if(dataSetElements.length == 0){
        resolve();
      }else{
        this.SqlLite.insertBulkDataOnTable(resource,dataSetElements,currentUser.currentDatabase).then(()=>{
          resolve();
        },error=>{
          console.log(JSON.stringify(error));
          reject(error);
        });
      }
    });


  }

  /**
   * sortDataSetList
   * @param dataSetList
   * @returns {any}
   */
  sortDataSetList(dataSetList){
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
   * getDataSetsByIds
   * @param dataSetsIds
   * @param currentUser
   * @returns {Promise<T>}
   */
  getDataSetsByIds(dataSetsIds,currentUser){
    let attribute = 'id';
    let dataSetsResponse = [];

    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(this.resource,attribute,dataSetsIds,currentUser.currentDatabase).then((dataSets : any)=>{
        this.sortDataSetList(dataSets);
        dataSets.forEach((dataSet : any)=>{
          dataSetsResponse.push({
            id: dataSet.id,
            name: dataSet.name,
            dataElements : dataSet.dataElements,
            dataSetElements : dataSet.dataSetElements
          });
        });
        resolve(dataSetsResponse);
      },error=>{
        reject(error);
      })
    });
  }

  /**
   *
   * @param dataSetId
   * @param currentUser
   * @returns {Promise<any>}
   */
  getDataElementsIdsOnDataSetElements(dataSetId,currentUser){
    let attributeKey = "id";
    let attributeArray = [dataSetId];
    return new Promise((resolve, reject)=> {
      this.SqlLite.getDataFromTableByAttributes(this.resource,attributeKey,attributeArray,currentUser.currentDatabase).then((dataSets : any)=>{
        if(dataSets && dataSets.length > 0){
          resolve(dataSets[0])
        }else{
          reject();
        }
      },error=>{reject(error)})
    });
  }


}
