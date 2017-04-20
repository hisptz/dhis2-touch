import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {HttpClient} from "./http-client";
import {SqlLite} from "./sql-lite";

import {ToastController} from 'ionic-angular';
import {NetworkAvailability} from "./network-availability";

/*
 Generated class for the DataValues provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class DataValues {

  public resourceName:string;

  constructor(public httpClient:HttpClient, public sqlLite:SqlLite,
              public NetworkAvailability:NetworkAvailability,
              public toastCtrl:ToastController) {
    this.resourceName = "dataValues";
  }

  setNotificationToasterMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  /**
   * get data values by status
   * @param currentUser
   * @param status
   * @returns {Promise<T>}
   */
  getDataValuesByStatus(currentUser, status) {
    let self = this;
    let attribute = "syncStatus";
    let attributeArray = [];
    attributeArray.push(status);
    return new Promise(function (resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resourceName, attribute, attributeArray, currentUser.currentDatabase).then((dataValues:any)=> {
        resolve(dataValues);
      }, error=> {
        reject(error);
      })
    });
  }


  /**
   * deleteDataValuesByIds
   * @param dataValueIds
   * @param currentUser
   * @returns {Promise<T>}
   */
  deleteDataValueByIds(dataValueIds, currentUser) {
    let self = this;
    let successCount = 0;
    let failCount = 0;
    return new Promise(function (resolve, reject) {
      for(let dataValueId of dataValueIds){
        self.sqlLite.deleteFromTableByAttribute(self.resourceName,"id",dataValueId, currentUser.currentDatabase).then(()=> {
          successCount = successCount + 1;
          if((successCount + failCount) == dataValueIds.length){
            resolve();
          }
        }, error=> {
          failCount = failCount + 1;
          if((successCount + failCount) == dataValueIds.length){
            resolve();
          }
        });
      }
    });
  }

  /**
   * uploaf data values to server
   * @param dataValues
   * @param currentUser
   */
  uploadDataValues(dataValues, currentUser) {

    let self = this;
    let formattedDataValues = self.getFormattedDataValueForUpload(dataValues);
    let uploadedDataValues = 0;
    let failOnUploadedDataValues = 0;
    let statusMessage = "";
    let network = self.NetworkAvailability.getNetWorkStatus();
    if (formattedDataValues.length > 0 && network.isAvailable) {
      self.setNotificationToasterMessage("Starting data synchronization process");
      formattedDataValues.forEach((formattedDataValue:any, index:any)=> {
        self.httpClient.post('/api/25/dataValues?' + formattedDataValue, {}, currentUser).subscribe(()=> {
          let syncedDataValues = dataValues[index];
          syncedDataValues["syncStatus"] = "synced";
          uploadedDataValues = uploadedDataValues + 1;
          if ((uploadedDataValues + failOnUploadedDataValues) == formattedDataValues.length) {
            statusMessage = uploadedDataValues + " data has been synced successfully .  " + failOnUploadedDataValues + " has failed to sync";
            self.setNotificationToasterMessage(statusMessage);
          }
          self.sqlLite.insertDataOnTable(self.resourceName, syncedDataValues, currentUser.currentDatabase).then(response=> {
          }, error=> {
          })
        }, error=> {
          console.log("Fail on uploading dataValues : " + JSON.stringify(error));
          failOnUploadedDataValues = failOnUploadedDataValues + 1;
          if ((uploadedDataValues + failOnUploadedDataValues) == formattedDataValues.length) {
            statusMessage = uploadedDataValues + " data has been synced successfully .  " + failOnUploadedDataValues + " has failed to sync";
            self.setNotificationToasterMessage(statusMessage);
          }
        });
      });
    }
  }

  /**
   * uploadAllDataValuesOnCompleteForm
   * @param dataValues
   * @param currentUser
   * @returns {Promise<T>}
   */
  uploadAllDataValuesOnCompleteForm(dataValues, currentUser) {
    let self = this;
    let formattedDataValues = self.getFormattedDataValueForUpload(dataValues);
    let uploadedDataValues = 0;
    let failOnUploadedDataValues = 0;
    return new Promise(function (resolve, reject) {
      formattedDataValues.forEach((formattedDataValue:any, index:any)=> {
        self.httpClient.post('/api/25/dataValues?' + formattedDataValue, {}, currentUser).subscribe(()=> {
          let syncedDataValues = dataValues[index];
          syncedDataValues["syncStatus"] = "synced";
          uploadedDataValues = uploadedDataValues + 1;
          if ((uploadedDataValues + failOnUploadedDataValues) == formattedDataValues.length) {
            resolve({uploadedDataValues: uploadedDataValues, failOnUploadedDataValues: failOnUploadedDataValues})
          }
          self.sqlLite.insertDataOnTable(self.resourceName, syncedDataValues, currentUser.currentDatabase).then(response=> {
          }, error=> {
          })
        }, error=> {
          failOnUploadedDataValues = failOnUploadedDataValues + 1;
          if ((uploadedDataValues + failOnUploadedDataValues) == formattedDataValues.length) {
            resolve({uploadedDataValues: uploadedDataValues, failOnUploadedDataValues: failOnUploadedDataValues})
          }
        })
      });
    });
  }

  /**
   * convert data values to parameter for uploading
   * @param dataValues
   * @returns {Array}
   */
  getFormattedDataValueForUpload(dataValues) {
    var formattedDataValues = [];
    dataValues.forEach((dataValue:any)=> {
      let formParameter = "de=" + dataValue.de + "&pe=" + dataValue.pe + "&ou=";
      formParameter += dataValue.ou + "&co=" + dataValue.co + "&value=" + dataValue.value;
      if (dataValue.cp != "0" && dataValue.cp != "") {
        formParameter = formParameter + "&cc=" + dataValue.cc + "&cp=" + dataValue.cp;
      }
      formattedDataValues.push(formParameter);
    });
    return formattedDataValues;
  }


  /**
   * get parameter for dataSet completeness for a given form
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @returns {string}
   */
  getDataSetCompletenessParameter(dataSetId, period, orgUnitId, dataDimension) {
    let parameter = "ds=" + dataSetId + "&pe=" + period + "&ou=" + orgUnitId;
    if (dataDimension.cp != "") {
      parameter += "&cc=" + dataDimension.cc + "&cp=" + dataDimension.cp;
    }
    return parameter;
  }

  /**
   *
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @param currentUser
   * @returns {Promise<T>}
   */
  completeOnDataSetRegistrations(dataSetId, period, orgUnitId, dataDimension, currentUser) {
    let self = this;
    let parameter = self.getDataSetCompletenessParameter(dataSetId, period, orgUnitId, dataDimension);
    return new Promise(function (resolve, reject) {
      self.httpClient.post('/api/25/completeDataSetRegistrations?' + parameter, {}, currentUser).subscribe(response=> {
        resolve();
      }, error=> {
        reject(error);
      });
    });
  }

  /**
   * delete data set completeness information
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @param currentUser
   * @returns {Promise<T>}
   */
  unDoCompleteOnDataSetRegistrations(dataSetId, period, orgUnitId, dataDimension, currentUser) {
    let self = this;
    let parameter = self.getDataSetCompletenessParameter(dataSetId, period, orgUnitId, dataDimension);
    return new Promise(function (resolve, reject) {
      self.httpClient.delete('/api/25/completeDataSetRegistrations?' + parameter, currentUser).subscribe(response=> {
        resolve();
      }, error=> {
        reject(error);
      });
    });
  }

  /**
   * get data set completeness information
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @param currentUser
   * @returns {Promise<T>}
   */
  getDataSetCompletenessInfo(dataSetId, period, orgUnitId, dataDimension, currentUser) {
    let self = this;
    let parameter = "dataSetId=" + dataSetId + "&periodId=" + period + "&organisationUnitId=" + orgUnitId;
    if (dataDimension.cp != "") {
      parameter += "&cc=" + dataDimension.cc + "&cp=" + dataDimension.cp;
    }
    return new Promise(function (resolve, reject) {
      self.httpClient.get('/dhis-web-dataentry/getDataValues.action?' + parameter, currentUser).subscribe(response=> {
        resolve(response.json());
      }, error=> {
        reject();
      });
    });

  }


  /**
   * get dataValues form server based on selected parameter
   * @param dataSet
   * @param period
   * @param orgUnit
   * @param attributeOptionCombo
   * @param currentUser
   * @returns {Promise<T>}
   */
  getDataValueSetFromServer(dataSet, period, orgUnit, attributeOptionCombo, currentUser) {
    let parameter = 'dataSet=' + dataSet + '&period=' + period + '&orgUnit=' + orgUnit;
    let self = this;
    return new Promise(function (resolve, reject) {
      self.httpClient.get('/api/25/dataValueSets.json?' + parameter, currentUser).subscribe(response=> {
        resolve(self.getFilteredDataValuesByDataSetAttributeOptionCombo(response.json(), attributeOptionCombo))
      }, error=> {
        reject(error.json());
      });
    });
  }


  /**
   * get dataset attribute option combo based on data entry form selection
   * @param dataValuesResponse
   * @param attributeOptionCombo
   * @returns {Array}
   */
  getFilteredDataValuesByDataSetAttributeOptionCombo(dataValuesResponse, attributeOptionCombo) {
    let FilteredDataValues = [];
    if (dataValuesResponse.dataValues) {
      dataValuesResponse.dataValues.forEach((dataValue:any)=> {
        if (dataValue.attributeOptionCombo == attributeOptionCombo) {
          FilteredDataValues.push({
            categoryOptionCombo: dataValue.categoryOptionCombo,
            dataElement: dataValue.dataElement,
            value: dataValue.value
          });
        }
      });
    }
    return FilteredDataValues;
  }


  /**
   * function to get correctly attribute option combo for downloading data values
   * @param dataDimension
   * @param categoryOptionCombos
   * @returns {string}
   */
  getDataValuesSetAttributeOptionCombo(dataDimension, categoryOptionCombos) {
    let attributeOptionCombo = "";
    if (dataDimension.cp != "") {
      let categoriesOptionsArray = dataDimension.cp.split(';');
      for (let i = 0; i < categoryOptionCombos.length; i++) {
        let hasAttributeOptionCombo = true;
        let categoryOptionCombo = categoryOptionCombos[i];
        categoryOptionCombo.categoryOptions.forEach((categoryOption:any)=> {
          if (categoriesOptionsArray.indexOf(categoryOption.id) == -1) {
            hasAttributeOptionCombo = false;
          }
        });
        if (hasAttributeOptionCombo) {
          attributeOptionCombo = categoryOptionCombo.id;
          break;
        }
      }
    } else {
      attributeOptionCombo = categoryOptionCombos[0].id;
    }
    return attributeOptionCombo;
  }


  /**
   * get all data values fro local storage
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param entryFormSections
   * @param currentUser
   * @returns {Promise<T>}
   */
  getAllEntryFormDataValuesFromStorage(dataSetId, period, orgUnitId, entryFormSections, dataDimension, currentUser) {
    let ids = [];
    let self = this;
    let entryFormDataValuesFromStorage = [];
    entryFormSections.forEach((section:any)=> {
      section.dataElements.forEach((dataElement:any)=> {
        dataElement.categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo:any)=> {
          ids.push(dataSetId + '-' + dataElement.id + '-' + categoryOptionCombo.id + '-' + period + '-' + orgUnitId);
        });
      });
    });
    return new Promise(function (resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resourceName, "id", ids, currentUser.currentDatabase).then((dataValues:any)=> {
        dataValues.forEach((dataValue:any)=> {
          if ((dataDimension.cp == dataValue.cp || dataValue.cp == "" || dataValue.cp == "0") && dataDimension.cc == dataValue.cc) {
            entryFormDataValuesFromStorage.push({
              id: dataValue.de + "-" + dataValue.co,
              value: dataValue.value,
              status: dataValue.syncStatus
            });
          }
        });
        resolve(entryFormDataValuesFromStorage)
      }, error=> {
        reject();
      });
    });
  }


  /**
   * furntion to get dataValue by id
   * @param id
   * @param currentUser
   * @returns {Promise<T>}
   */
  getDataValuesById(id, currentUser) {
    let self = this;
    let ids = [];
    ids.push(id);
    return new Promise(function (resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resourceName, "id", ids, currentUser.currentDatabase).then((dataValues:any)=> {
        resolve(dataValues)
      }, error=> {
        reject();
      });
    });
  }

  /**
   * saving data davlues
   * @param dataValues
   * @param dataSetId
   * @param period
   * @param orgUnitId
   * @param dataDimension
   * @param syncStatus
   * @param currentUser
   * @returns {Promise<T>}
   */
  saveDataValues(dataValues, dataSetId, period, orgUnitId, dataDimension, syncStatus, currentUser) {
    let self = this;
    return new Promise(function (resolve, reject) {
      let promises = [];
      dataValues.forEach((dataValue:any)=> {
        let data = {
          id: dataSetId + '-' + dataValue.dataElement + '-' + dataValue.categoryOptionCombo + '-' + period + '-' + orgUnitId,
          de: dataValue.dataElement,
          co: dataValue.categoryOptionCombo,
          pe: period,
          ou: orgUnitId,
          cc: dataDimension.cc,
          cp: dataDimension.cp,
          value: dataValue.value,
          syncStatus: syncStatus,
          dataSetId: dataSetId,
          period: dataValue.period,
          orgUnit: dataValue.orgUnit
        };
        promises.push(
          self.sqlLite.insertDataOnTable(self.resourceName, data, currentUser.currentDatabase).then(response=> {
          }, error=> {
          })
        );

      });
      Observable.forkJoin(promises).subscribe(() => {
        resolve();
      }, (error) => {
        reject();
      })
    });
  }


}
