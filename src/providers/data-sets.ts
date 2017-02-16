import { Injectable } from '@angular/core';
import {SqlLite} from "./sql-lite/sql-lite";

/*
  Generated class for the DataSets provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataSets {

  public resource : string;

  constructor(private sqlLite : SqlLite) {
    this.resource = "dataSets";
  }

  getAssignedDataSetsByOrgUnit(selectedOrgUnit,dataSetIdsByUserRoles,currentUser){
    let attribute = 'id';
    let attributeValue =[];
    let assignedDataSetsByOrgUnit = [];
    let self = this;
    return new Promise(function(resolve, reject) {
      selectedOrgUnit.dataSets.forEach((dataSet:any)=>{
        if(dataSetIdsByUserRoles.indexOf(dataSet.id) != -1){
          attributeValue.push(dataSet.id);
        }
      });
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeValue,currentUser.currentDatabase).then((dataSets : any)=>{
        dataSets.forEach((dataSet : any)=>{
          assignedDataSetsByOrgUnit.push({
            id: dataSet.id,
            name: dataSet.name,
            openFuturePeriods: dataSet.openFuturePeriods,
            periodType : dataSet.periodType,
            categoryCombo : dataSet.categoryCombo
          });
        });
        resolve(assignedDataSetsByOrgUnit)
      },error=>{
        reject(error);
      })
    });
  }

  getDataSetById(dataSetId,currentUser){
    let attribute = "id";
    let attributeValue = [];
    attributeValue.push(dataSetId);
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sqlLite.getDataFromTableByAttributes(self.resource,attribute,attributeValue,currentUser.currentDatabase).then((dataSets : any)=>{
        if(dataSets.length > 0){
          resolve(dataSets[0]);
        }else{
          reject(" dataSet with id "+dataSetId+" has nit being found");
        }
      },error=>{
        reject(error);
      });
    });
  }

}
